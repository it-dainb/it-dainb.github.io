import SimulatorPlugins from "./reusable/SimulatorPlugins.js"
import SignalPills from "./reusable/SignalPills.js"
import GoogleMapsFromSignal from "./reusable/GoogleMapsFromSignal.js"
import SignalTile from "./reusable/SignalTile.js"
import LineChart from "./reusable/LineChart.js"
import { PLUGINS_APIKEY } from "./reusable/apikey.js";

const plugin = ({widgets, simulator, vehicle}) => {

    const LatitudeTile = {
        signal: "Vehicle.CurrentLocation.Latitude",
        label: "Latitude",
        icon: "charging-station",
    }
    
    const LongitudeTile = {
        signal: "Vehicle.CurrentLocation.Longitude",
        label: "Longitude",
        icon: "satellite"
    }

    const ETATile = {
        signal: "Vehicle.Cabin.Infotainment.Navigation.DestinationSet.ETA",
        label: "ETA",
        icon: "flag-checkered",
        suffix: "s"
    }
    

    widgets.register(
        "LatitudeTile",
        SignalTile(
            LatitudeTile,
            vehicle
        )
    )
    
    
    widgets.register(
        "LongitudeTile",
        SignalTile(
            LongitudeTile,
            vehicle
        )
    )

    widgets.register(
        "ETATile",
        SignalTile(
            ETATile,
            vehicle
        )
    )
    widgets.register(
        "LatLongPills",
        SignalPills(
            [
                LatitudeTile,
                LongitudeTile,
            ],
            vehicle
        )
    )
    
}

export default plugin