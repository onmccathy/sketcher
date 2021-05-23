// icons
import HomeIcon from '@material-ui/icons/Home';
import DashboardIcon from '@material-ui/icons/BarChartOutlined';
import {MeetingRoom} from '@material-ui/icons';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import GitHubIcon from '@material-ui/icons/GitHub';
import PrivateIcon from '@material-ui/icons/LockOutlined';
import PublicIcon from '@material-ui/icons/LockOpenOutlined';

// components
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import MeetUps from '../pages/MeetUps'
import GHPrivate from '../pages/GitHub/PrivateRepo';
import GHPublic from '../pages/GitHub/PublicRepo';
import Settings from '../pages/Settings';

// interface
import RouteItem from '../model/RouteItem.model';

// define app routes
export const routes: Array<RouteItem> = [
    {
        key: "router-home",
        title: "Home",
        tooltip: "Home",
        path: "/",
        enabled: true,
        component: Home,
        icon: HomeIcon,
        appendDivider: true
    },
    {
        key: "router-meetup",
        title: "MeetUp",
        tooltip: "MeetUp",
        path: "/meetup",
        enabled: true,
        component: MeetUps,
        icon: MeetingRoom
    },
    {
        key: "router-gh",
        title: "GitHub",
        tooltip: "GitHub",
        enabled: true,
        icon: GitHubIcon,
        subRoutes: [
            {
                key: "router-gh-private",
                title: "Private Repos",
                tooltip: "Private Repos",
                path: "/gh/private",
                enabled: true,
                component: GHPrivate,
                icon: PrivateIcon
            },
            {
                key: "router-gh-public",
                title: "Public Repos",
                tooltip: "Public Repos",
                path: "/gh/public",
                enabled: false,
                component: GHPublic,
                icon: PublicIcon
            }
        ]
    },
    
    {
        key: "router-settings",
        title: "Settings",
        tooltip: "Settings",
        path: "/settings",
        enabled: true,
        component: Settings,
        icon: SettingsIcon
    },
]