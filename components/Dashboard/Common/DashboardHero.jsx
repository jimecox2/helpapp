'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/config/site';
import { Home, BarChart2, PieChart, Grid, Activity, } from 'lucide-react';
import { licenseCheck } from '@/lib/helpers/customfunctions';


const DashboardHero = ({ heroData, token, useremail }) => {
  const [license, setLicense] = useState(null);
  const [expires, setExpires] = useState(null);

  useEffect(() => {
    const checkLicense = async () => {
      const { license, expires } = await licenseCheck(useremail, token, API_URL);
      setLicense(license);
      setExpires(expires);
    };

    checkLicense();
  }, [useremail, token, API_URL]);


  const menuItems = [
    { name: "Dashboard Home", icon: <Home size={20} />, link: "/dashboard", access: "all" },
    { name: "Project Status Cards ", icon: <Grid size={20} />, link: "/dashboard/tabular/cardtop", access: ["TBT02", "TBT03", "CBT02", "CBT03"] },
    { name: "Variance Report", icon: <Grid size={20} />, link: "/dashboard/tabular/variance", access: ["ABT02", "ABT03"] },
    { name: "Burndown Chart", icon: <Activity size={20} />, link: "/dashboard/burndown", access: ["ABT02", "ABT03"] },
    { name: "Resource Graphs", icon: <BarChart2 size={20} />, link: "/dashboard/resources", access: ["TBT02", "TBT03", "CBT02", "CBT03"] },
    { name: "Charts", icon: <PieChart size={20} />, link: "/dashboard/charts", access: ["TBT02", "TBT03", "CBT02", "CBT03"] },
    // { name: "Tabular Cards Side", icon: <Layers size={20} />, link: "/dashboard/tabularsidebyside", access: ["TBT02", "TBT03", "CBT02", "CBT03"] },
    // { name: "Agilebars Backlogs", icon: <FileText size={20} />, link: "/dashboard/tabularab", access: ["ABT02", "ABT03", "TBT02", "TBT03", "CBT02", "CBT03"] },
    // { name: "Tree View", icon: <GitBranch size={20} />, link: "/dashboard/tree", access: ["CBT02", "CBT03"] },
  ];

  return (
    <section className="bg-gradient-to-r from-gray-900 to-blue-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center mb-8 md:mb-0">
            <div className="flex-shrink-0 mr-6">
              <Image
                className="h-24 w-24 rounded-full shadow-lg"
                src={heroData.bgImageURL}
                width={96}
                height={96}
                alt="Dashboard logo"
              />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white leading-tight">
                {heroData.titleText}
              </h1>
              <p className="mt-2 text-xl text-blue-300">
                {heroData.sloganText}
              </p>
            </div>
          </div>
          <div className="text-white text-right">
            <p>Your License: {license || 'N/A'}</p>
            <p>Expires: {expires || 'N/A'}</p>
          </div>
        </div>

        <nav className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mt-8">
          <ul className="flex flex-wrap justify-center gap-4">
            {menuItems.map((item, index) => (
              (item.access === "all" || (Array.isArray(item.access) && item.access.includes(license))) && (
                <li key={index}>
                  <Link href={item.link} className="flex items-center px-4 py-2 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors duration-200">
                    {item.icon}
                    <span className="ml-2 text-white">{item.name}</span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default DashboardHero;