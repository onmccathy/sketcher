// icons
import HomeIcon from '@material-ui/icons/Home';
import {MeetingRoom} from '@material-ui/icons';

// components
import Home from '../pages/Home';
import MeetUps from '../pages/MeetUps'
import Sketches from '../pages/Sketches'



// interfaces
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
        key: "router-sketches",
        title: "Sketches",
        tooltip: "Add sketch from Google Photos",
        path: "/sketch",
        enabled: true,
        component: Sketches,
        icon: MeetingRoom,
        
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
    
]