import SignalTile from "../reusable/SignalTile.js";
import SignalPills from "../reusable/SignalPills.js";

const PositionPlugin = ({widgets, vehicle}) => {
    const LatitudeTile = {
        signal: "Vehicle.CurrentLocation.HorizontalAccuracy",
        label: "Longitude",
        icon: "satellite",
    }

    const LongitudeTile = {
        signal: "Vehicle.CurrentLocation.VerticalAccuracy",
        label: "Latitude",
        icon: "satellite",
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

export default PositionPlugin;