// app/personaldashboard/tabular/variance/page.jsx
import { auth } from "@/auth/auth"
import { redirect } from "next/navigation"
import { API_URL, FRONTEND_URL } from '@/config/site';
import DashboardHero from "../../_components/DashboardHero.jsx"
import ItemDetailsDataComponent from "@/components/Dashboard/Reports/ItemDetailsDataComponent.jsx"


const VarianceHomePage = async () => {
    const session = await auth()

    if (!session) {
        redirect("/auth/signin?callbackUrl=/personaldashboard")
    }

    const { user: { id, email, name }, jwt } = session;

    const heroData = {
        bgImageURL: "/images/julia-lake.png",
        videoURL: "https://youtu.be/Q7GOT2IkIaQ",
        buttonURL: "/sales/pricing",
        titleText: `Variance to Baseline Reporting`,
        sloganText: `Welcome ${name}`
    }

    const reportType = "variance"
    return (
        <div>
            <DashboardHero heroData={heroData} token={jwt} useremail={email} />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Project Variance Report</h1>
                <ItemDetailsDataComponent token={jwt} reportType={reportType} />
            </div>
        </div>
    );
};

export default VarianceHomePage;