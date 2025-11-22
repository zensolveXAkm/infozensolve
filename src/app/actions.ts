
"use server";

import { z } from "zod";
import { db, storage } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit, setDoc, doc, where, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { revalidatePath } from "next/cache";


export async function getLogs() {
  try {
    const logsQuery = query(collection(db, "activityLogs"), orderBy("timestamp", "desc"), limit(10));
    const logsSnapshot = await getDocs(logsQuery);
    const logs = logsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate(),
      }
    });
    return { success: true, logs };
  } catch (error) {
    console.error("Error fetching logs:", error);
    return { success: false, logs: [] };
  }
}


const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function submitContactForm(data: z.infer<typeof contactFormSchema>) {
  const validatedFields = contactFormSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    console.log("Form submitted successfully:", validatedFields.data);
    
    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

const jobSchema = z.object({
  title: z.string().min(3, "Title is required."),
  company: z.string().min(2, "Company name is required."),
  location: z.string().min(2, "Location is required."),
  type: z.string().min(1, "Job type is required."),
  workMode: z.string().min(1, "Work mode is required."),
  experienceMin: z.coerce.number().min(0).optional(),
  experienceMax: z.coerce.number().min(0).optional(),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  department: z.string().min(1, "Department is required."),
  companyType: z.string().min(1, "Company type is required."),
  roleCategory: z.string().min(1, "Role category is required."),
  education: z.string().min(1, "Education is required."),
  industry: z.string().min(1, "Industry is required."),
  description: z.string().min(10, "Description is required."),
  tags: z.string().optional(),
});


export async function addJob(data: z.infer<typeof jobSchema>) {
  const validatedFields = jobSchema.safeParse(data);

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Invalid job data. Please check all fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const jobData = validatedFields.data;
    const tagsArray = jobData.tags ? jobData.tags.split(',').map(tag => tag.trim()) : [];
    
    await addDoc(collection(db, "jobs"), {
      ...jobData,
      tags: tagsArray,
      postedAt: serverTimestamp(),
    });

    revalidatePath("/jobs");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Job added successfully!",
    };

  } catch (error) {
    console.error("Error adding job:", error);
    return {
      success: false,
      message: "Failed to add job. Please try again.",
    };
  }
}


const applicationSchema = z.object({
  jobId: z.string(),
  fullName: z.string().min(2, "Full name is required."),
  dob: z.string().optional(),
  gender: z.string().optional(),
  mobile: z.string().min(10, "A valid mobile number is required."),
  email: z.string().email("A valid email address is required."),
  whatsapp: z.string().optional(),
  permanentAddress: z.string().optional(),
  currentAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  highestQualification: z.string().optional(),
  yearOfPassing: z.string().optional(),
  university: z.string().optional(),
  specialization: z.string().optional(),
  hasExperience: z.enum(["yes", "no"]),
  previousCompany: z.string().optional(),
  designation: z.string().optional(),
  yearsOfExperience: z.coerce.number().optional(),
  linkedin: z.string().optional(),
  technicalSkills: z.string().optional(),
  softSkills: z.string().optional(),
  certifications: z.string().optional(),
  languages: z.array(z.string()).optional(),
  preferredRole: z.string().optional(),
  preferredLocation: z.string().optional(),
  expectedSalary: z.string().optional(),
  noticePeriod: z.string().optional(),
  readyToRelocate: z.enum(["yes", "no"]),
  whyShouldWeHireYou: z.string().optional(),
  confirmInfo: z.boolean().refine(val => val === true, { message: "You must confirm the information is true." }),
  agreeTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms." }),
  resumeUrl: z.string().url("Failed to upload resume.").optional(),
});


export async function applyForJob(prevState: any, formData: FormData) {
    
    const rawData = Object.fromEntries(formData.entries());
    
    // Convert checkbox values
    const data = {
      ...rawData,
      languages: formData.getAll('languages'),
      yearsOfExperience: rawData.yearsOfExperience ? Number(rawData.yearsOfExperience) : undefined,
      confirmInfo: rawData.confirmInfo === 'on',
      agreeTerms: rawData.agreeTerms === 'on',
    };
    
    const validatedFields = applicationSchema.safeParse(data);

    if (!validatedFields.success) {
        console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors);
        return {
        success: false,
        message: "Invalid application data. Please check all fields.",
        errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        let applicationData: Partial<z.infer<typeof applicationSchema>> = { ...validatedFields.data };
        const resumeFile = formData.get('resume') as File | null;
        
        if (resumeFile && resumeFile.size > 0) {
            const storageRef = ref(storage, `resumes/${validatedFields.data.jobId}/${Date.now()}-${resumeFile.name}`);
            const snapshot = await uploadBytes(storageRef, resumeFile);
            const downloadURL = await getDownloadURL(snapshot.ref);
            applicationData.resumeUrl = downloadURL;
        }

        await addDoc(collection(db, "applications"), {
          ...applicationData,
          submittedAt: serverTimestamp(),
        });

        return {
          success: true,
          message: "Application submitted successfully! We will get back to you soon.",
        };

    } catch (error) {
        console.error("Error submitting application:", error);
        return {
          success: false,
          message: "Failed to submit application. Please try again.",
        };
    }
}

const attendanceSchema = z.object({
  status: z.enum(["working", "leave"]),
  tasks: z.string().optional(),
  employeeId: z.string(),
  employeeName: z.string(),
});

export async function markAttendance(data: z.infer<typeof attendanceSchema>) {
  const validatedFields = attendanceSchema.safeParse(data);
  if (!validatedFields.success) {
    return { success: false, message: "Invalid data." };
  }
  try {
    await addDoc(collection(db, "attendance"), {
      ...validatedFields.data,
      date: serverTimestamp(),
    });
    return { success: true, message: "Attendance marked successfully." };
  } catch (error) {
    return { success: false, message: "Failed to mark attendance." };
  }
}


const dsrSchema = z.object({
  description: z.string().min(10, "Description is required."),
  hasTravelled: z.boolean().default(false),
  openingKm: z.coerce.number().optional(),
  closingKm: z.coerce.number().optional(),
  employeeId: z.string(),
  employeeName: z.string(),
});

export async function submitDsr(data: z.infer<typeof dsrSchema>) {
  const validatedFields = dsrSchema.safeParse(data);
   if (!validatedFields.success) {
    return { success: false, message: "Invalid data.", errors: validatedFields.error.flatten().fieldErrors, };
  }
  try {
    await addDoc(collection(db, "dsr"), {
      ...validatedFields.data,
      date: serverTimestamp(),
    });
    return { success: true, message: "DSR submitted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to submit DSR." };
  }
}

const callLogSchema = z.object({
  clientName: z.string().min(2, "Client name is required."),
  clientMobile: z.string().min(10, "A valid mobile number is required."),
  topic: z.string().min(5, "Topic is required."),
  duration: z.coerce.number().min(1, "Duration must be at least 1 minute."),
  employeeId: z.string(),
  employeeName: z.string(),
});


export async function logCall(data: z.infer<typeof callLogSchema>) {
  const validatedFields = callLogSchema.safeParse(data);
   if (!validatedFields.success) {
    return { success: false, message: "Invalid data.", errors: validatedFields.error.flatten().fieldErrors, };
  }
  try {
    await addDoc(collection(db, "callLogs"), {
      ...validatedFields.data,
      date: serverTimestamp(),
    });
    return { success: true, message: "Call logged successfully." };
  } catch (error) {
    return { success: false, message: "Failed to log call." };
  }
}

const earningsSchema = z.object({
  earnings: z.array(z.object({
    description: z.string().min(3, "Description is required."),
    amount: z.coerce.number().min(1, "Amount must be greater than 0."),
  })).min(1, "Please add at least one earning."),
  employeeId: z.string(),
  employeeName: z.string(),
});

export async function submitEarnings(data: z.infer<typeof earningsSchema>) {
  const validatedFields = earningsSchema.safeParse(data);
   if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return { success: false, message: "Invalid data.", errors: validatedFields.error.flatten().fieldErrors, };
  }
  try {
    const { employeeId, employeeName } = validatedFields.data;
    const earningPromises = validatedFields.data.earnings.map(earning => {
       return addDoc(collection(db, "earnings"), {
        ...earning,
        employeeId,
        employeeName,
        date: serverTimestamp(),
      });
    })
    await Promise.all(earningPromises);
    
    return { success: true, message: "Earnings submitted successfully." };
  } catch (error) {
    return { success: false, message: "Failed to submit earnings." };
  }
}

const registrationSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters."),
  mobile: z.string().min(10, "A valid 10-digit mobile number is required.").max(10, "A valid 10-digit mobile number is required."),
  personalEmail: z.string().email("Please enter a valid personal email."),
  userId: z.string().min(3, "User ID is required.").refine(val => val.endsWith('@zensolve.in'), { message: "User ID must end with @zensolve.in" }),
  password: z.string().min(6, "Password must be at least 6 characters."),
  district: z.string().min(2, "District is required."),
  state: z.string().min(2, "State is required."),
  pincode: z.string().length(6, "Pincode must be 6 digits."),
});


export async function registerEmployee(data: z.infer<typeof registrationSchema>) {
  const validatedFields = registrationSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid registration data. Please check all fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const { fullName, userId, password, ...otherData } = validatedFields.data;
    
    // Create user in Firebase Auth
    // IMPORTANT: This uses the main `auth` instance. This action must be protected.
    const userCredential = await createUserWithEmailAndPassword(auth, userId, password);
    const user = userCredential.user;

    // Save employee data to Firestore
    await setDoc(doc(db, "employees", user.uid), {
      name: fullName,
      userId: userId,
      mobile: otherData.mobile,
      personalEmail: otherData.personalEmail,
      district: otherData.district,
      state: otherData.state,
      pincode: otherData.pincode,
      createdAt: serverTimestamp(),
      status: 'active', // Default status
    });

    revalidatePath("/admin/employees");

    return {
      success: true,
      message: "Employee registered successfully!",
      userId: userId,
      password: password,
    };

  } catch (error: any) {
    console.error("Error registering employee:", error);
    
    let errorMessage = "Failed to register employee. Please try again.";
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "This User ID is already taken. Please try with a different User ID.";
    } else if (error.code === 'auth/weak-password') {
        errorMessage = "The password is too weak. It must be at least 6 characters long.";
    }


    return {
      success: false,
      message: errorMessage,
    };
  }
}

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
  const validatedFields = newsletterSchema.safeParse({
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid email address.",
    };
  }

  try {
    // Check if email already exists
    const q = query(collection(db, "newsletterSubscribers"), where("email", "==", validatedFields.data.email));
    const existingSubscriber = await getDocs(q);
    if (!existingSubscriber.empty) {
      return { success: true, message: "You are already subscribed!" };
    }

    await addDoc(collection(db, "newsletterSubscribers"), {
      email: validatedFields.data.email,
      subscribedAt: serverTimestamp(),
    });

    revalidatePath("/admin/newsletter");
    
    return {
      success: true,
      message: "Thank you for subscribing!",
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

const membershipApplicationSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  phone: z.string().min(10, "A valid 10-digit phone number is required."),
  district: z.string().min(2, "District is required."),
  state: z.string().min(2, "State is required."),
  utr: z.string().min(10, "A valid UTR/Transaction ID is required."),
});

export async function applyForMembership(data: z.infer<typeof membershipApplicationSchema>) {
    const validatedFields = membershipApplicationSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid data. Please check all fields.",
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const docRef = await addDoc(collection(db, "memberships"), {
            ...validatedFields.data,
            status: "pending",
            submittedAt: serverTimestamp(),
        });
        
        return {
            success: true,
            message: "Application submitted successfully!",
            membershipId: docRef.id,
        };
    } catch (error) {
        console.error("Error submitting membership application:", error);
        return {
            success: false,
            message: "Failed to submit application. Please try again.",
        };
    }
}


const verifyMembershipSchema = z.object({
  membershipId: z.string(),
  email: z.string().email(),
  password: z.string(), // The phone number will be used as password
});

export async function verifyMembership(data: z.infer<typeof verifyMembershipSchema>) {
    const validatedFields = verifyMembershipSchema.safeParse(data);

    if (!validatedFields.success) {
        return { success: false, message: "Invalid data." };
    }

    const { membershipId, email, password } = validatedFields.data;

    try {
        // Create user in Firebase Auth
        await createUserWithEmailAndPassword(auth, email, password);

        // Update membership status in Firestore
        const membershipRef = doc(db, "memberships", membershipId);
        await updateDoc(membershipRef, {
            status: 'verified'
        });
        
        revalidatePath("/admin/memberships");
        
        return { success: true, message: "Membership verified and user created." };

    } catch (error: any) {
        console.error("Error verifying membership:", error);
        if (error.code === 'auth/email-already-in-use') {
            // If user already exists, just mark as verified
            const membershipRef = doc(db, "memberships", membershipId);
            await updateDoc(membershipRef, { status: 'verified' });
            revalidatePath("/admin/memberships");
            return { success: true, message: "User already exists. Membership marked as verified." };
        }
        return { success: false, message: error.message || "Failed to verify membership." };
    }
}
