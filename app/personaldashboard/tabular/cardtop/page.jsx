// app/personaldashboard/tabular/cardtop/page.jsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { API_URL, FRONTEND_URL } from '@/config/site';
import DashboardHero from "../../_components/DashboardHero.jsx"
import TabularCardTopcomponent from "@/components/Dashboard/Cards/CardTopDataComponent.jsx"

const TabularCardTopPage = async () => {
  const session = await auth()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/personaldashboard/tabular/cardtop")
  }
  const { user: { id, email, name }, jwt } = session;

  const heroData = {
    bgImageURL: "/images/julia-lake.png",
    videoURL: "https://youtu.be/Q7GOT2IkIaQ",
    buttonURL: "/sales/pricing",
    titleText: `Personal Dashboard - Project Status Cards - Drilldown`,
    sloganText: `Dashboard - ${name}!`
  }

  return (

    <div>

      <DashboardHero heroData={heroData} token={jwt} useremail={email} />

      <TabularCardTopcomponent />

    </div>
 );
};

export default TabularCardTopPage;