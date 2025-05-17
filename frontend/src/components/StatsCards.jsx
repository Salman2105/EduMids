import React from "react";
import { Card } from "./ui/card"; // Adjusted import path
import { Users, UserCog, BookOpen, DollarSign } from "lucide-react";

// StatCard Component
const StatCard = ({ title, value, icon, iconBg }) => (
  <Card className="p-4 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-md flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </Card>
);

// StatsCards Component
const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard 
        title="Students" 
        value="12,478" 
        icon={<Users size={20} className="text-white" />}
        iconBg="bg-blue-500" 
      />
      <StatCard 
        title="Teachers" 
        value="478" 
        icon={<UserCog size={20} className="text-white" />}
        iconBg="bg-rose-500" 
      />
      <StatCard 
        title="Parents" 
        value="8,908" 
        icon={<Users size={20} className="text-white" />}
        iconBg="bg-indigo-500" 
      />
      {/* <StatCard 
        title="Earnings" 
        value="$42.8k" 
        icon={<DollarSign size={20} className="text-white" />}
        iconBg="bg-amber-500" 
      /> */}
    </div>
  );
};

export default StatsCards;
