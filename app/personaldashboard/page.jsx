// app/personaldashboard/page.jsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { API_URL, FRONTEND_URL } from '@/config/site';
import DashboardHero from "./_components/DashboardHero.jsx"
import ItemDetailsDataComponent from "@/components/Dashboard/Reports/ItemDetailsDataComponent.jsx"


const DashboardHomePage = async () => {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/personaldashboard")
  }

  const { user: { id, email, name }, jwt } = session;

  const heroData = {
    bgImageURL: "/images/julia-lake.png",
    videoURL: "https://youtu.be/Q7GOT2IkIaQ",
    buttonURL: "/sales/pricing",
    titleText: `Personal Dashboard Home`,
    sloganText: `Welcome ${name}`
  }

  return (
    <div>
      <DashboardHero heroData={heroData} token={jwt} useremail={email} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Project Status Report</h1>
        <ItemDetailsDataComponent token={jwt} reportType={"default"} />
      </div>
    </div>
  );
};

export default DashboardHomePage;