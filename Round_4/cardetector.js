import SignalPills from "./reusable/SignalPills.js"
import SignalTile from "./reusable/SignalTile.js"

const plugin = ({widgets, simulator, vehicle}) => {

    const LatitudeTile = {
        signal: "Vehicle.CurrentLocation.Latitude",
        label: "Latitude",
        icon: "satellite",
    }
    
    const LongitudeTile = {
        signal: "Vehicle.CurrentLocation.Longitude",
        label: "Longitude",
        icon: "satellite"
    }

    const Speed = {
        signal: "Vehicle.Speed",
        label: "Speed",
        icon: "speed"
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
    
    widgets.register(
        "Speed",
        SignalTile(
            Speed,
            vehicle
        )
    )
    
}

export default plugin