
"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { Loader2, User, GraduationCap, Briefcase, Sparkles, Home, File, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApplicationData {
    id: string;
    fullName: string;
    email: string;
    mobile: string;
    dob?: string;
    gender?: string;
    whatsapp?: string;
    permanentAddress?: string;
    currentAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
    highestQualification?: string;
    yearOfPassing?: string;
    university?: string;
    specialization?: string;
    hasExperience: 'yes' | 'no';
    previousCompany?: string;
    designation?: string;
    yearsOfExperience?: number;
    linkedin?: string;
    technicalSkills?: string;
    softSkills?: string;
    certifications?: string;
    languages?: string[];
    preferredRole?: string;
    preferredLocation?: string;
    expectedSalary?: string;
    noticePeriod?: string;
    readyToRelocate: 'yes' | 'no';
    whyShouldWeHireYou?: string;
    resumeUrl?: string;
    submittedAt: Timestamp;
}

const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    );
};

export default function ApplicationDetailPage({ params }: { params: { applicationId: string } }) {
    const [application, setApplication] = useState<ApplicationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchApplication = async () => {
            setIsLoading(true);
            try {
                const docRef = doc(db, "applications", params.applicationId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setApplication({ id: docSnap.id, ...docSnap.data() } as ApplicationData);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching application:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApplication();
    }, [params.applicationId]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!application) {
        return <div className="flex justify-center items-center h-screen"><p>Application not found.</p></div>;
    }

    return (
        <div className="flex min-h-screen flex-col bg-secondary p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{application.fullName}</h1>
                        <p className="text-muted-foreground">{application.email} &bull; {application.mobile}</p>
                    </div>
                    {application.resumeUrl && (
                        <Button asChild>
                            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <File className="mr-2 h-4 w-4" /> View Resume
                            </a>
                        </Button>
                    )}
                </div>
                 <p className="text-sm text-muted-foreground mt-2">
                    Submitted on: {format(application.submittedAt.toDate(), "PPP p")}
                </p>
            </header>

            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><User /> Personal Details</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <DetailItem label="Date of Birth" value={application.dob ? format(new Date(application.dob), 'PP') : ''} />
                        <DetailItem label="Gender" value={application.gender} />
                        <DetailItem label="WhatsApp Number" value={application.whatsapp} />
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Home /> Address</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Current Address" value={application.currentAddress} />
                        <DetailItem label="Permanent Address" value={application.permanentAddress} />
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                             <DetailItem label="City" value={application.city} />
                             <DetailItem label="State" value={application.state} />
                             <DetailItem label="Pincode" value={application.pincode} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap /> Education</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DetailItem label="Highest Qualification" value={application.highestQualification} />
                        <DetailItem label="Year of Passing" value={application.yearOfPassing} />
                        <DetailItem label="University/Board" value={application.university} />
                        <DetailItem label="Specialization" value={application.specialization} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase /> Work Experience</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Badge variant={application.hasExperience === 'yes' ? 'default' : 'secondary'}>
                            {application.hasExperience === 'yes' ? 'Experienced' : 'Fresher'}
                        </Badge>
                        {application.hasExperience === 'yes' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DetailItem label="Previous Company" value={application.previousCompany} />
                                <DetailItem label="Designation" value={application.designation} />
                                <DetailItem label="Years of Experience" value={`${application.yearsOfExperience} years`} />
                            </div>
                        )}
                         {application.linkedin && (
                            <div>
                               <p className="text-sm text-muted-foreground">LinkedIn Profile</p>
                               <a href={application.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center gap-1">
                                    {application.linkedin} <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles /> Skills & Preferences</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                       <div>
                            <p className="text-sm font-semibold mb-2">Technical Skills</p>
                            <p className="text-muted-foreground">{application.technicalSkills || 'N/A'}</p>
                       </div>
                       <div>
                            <p className="text-sm font-semibold mb-2">Soft Skills</p>
                            <p className="text-muted-foreground">{application.softSkills || 'N/A'}</p>
                       </div>
                       <div>
                            <p className="text-sm font-semibold mb-2">Certifications</p>
                            <p className="text-muted-foreground">{application.certifications || 'N/A'}</p>
                       </div>
                       <div>
                            <p className="text-sm font-semibold mb-2">Languages</p>
                             <div className="flex gap-2">
                                {application.languages && application.languages.length > 0 ? application.languages.map(lang => (
                                    <Badge key={lang} variant="outline">{lang}</Badge>
                                )) : <p className="text-muted-foreground">N/A</p>}
                             </div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t pt-6">
                            <DetailItem label="Preferred Role" value={application.preferredRole} />
                            <DetailItem label="Preferred Location" value={application.preferredLocation} />
                            <DetailItem label="Expected Salary" value={application.expectedSalary ? `${application.expectedSalary} LPA` : ''} />
                            <DetailItem label="Notice Period" value={application.noticePeriod} />
                            <DetailItem label="Ready to Relocate" value={application.readyToRelocate} />
                       </div>
                       <div>
                            <p className="text-sm font-semibold mb-2">Why should we hire you?</p>
                            <p className="text-muted-foreground italic">"{application.whyShouldWeHireYou || 'N/A'}"</p>
                       </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


    