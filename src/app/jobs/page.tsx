import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import JobListings from "@/components/sections/job-listings";

export default function JobsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header variant="default" />
      <main className="flex-1 py-24 md:py-32">
        <JobListings />
      </main>
      <Footer />
    </div>
  );
}
