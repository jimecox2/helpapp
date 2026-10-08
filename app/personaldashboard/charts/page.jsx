// app/personaldashboard/charts/page.jsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { API_URL, FRONTEND_URL } from '@/config/site';
import DashboardHero from "../_components/DashboardHero.jsx"
import ResourceCostUsageDataComponent from "@/components/Dashboard/Charts/ResourceCostUsageDataComponent.jsx"


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
    titleText: `Personal Dashboard - Cost Charts`,
    sloganText: `Welcome ${name}`
  }
  return (
    <div>

      <DashboardHero heroData={heroData} token={jwt} useremail={email} />

      <div className="bg-gradient-to-r from-gray-100 to-blue-50 p-6 rounded-lg shadow-lg">

<ResourceCostUsageDataComponent />

      </div>


    </div>
  );
};

export default DashboardHomePage;