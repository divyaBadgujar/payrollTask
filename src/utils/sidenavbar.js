import dashboardLogo from "../layouts/AppLayout/SVGComponents/dashboardLogo.svg";
import teamLogo from "../layouts/AppLayout/SVGComponents/teamLogo.svg";
import taskLogo from "../layouts/AppLayout/SVGComponents/taskLogo.svg";
import dollar from "../layouts/AppLayout/SVGComponents/dollar.svg";
import settingLogo from "../layouts/AppLayout/SVGComponents/settingLogo.svg";
import logo from "../assets/FFC-logo.png";

export const sidenavbar = [
  {
    route: "dashboard",
    title: "Test Field Force",
    icon: logo,
  },
  {
    route: "dashboard",
    title: "Dashboard",
    icon: dashboardLogo,
  },
  {
    route: "myteam",
    title: "My Team",
    icon: teamLogo,
  },
  {
    route: "mytask",
    title: "My Task",
    icon: taskLogo,
  },
  {
    route: "billing",
    title: "Billing",
    icon: dollar,
  },
  {
    route: "settings",
    title: "Settings",
    icon: settingLogo,
  },
];