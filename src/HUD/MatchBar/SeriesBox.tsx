import * as I from "csgogsi";
import { Match } from "../../API/types";

interface Props {
  map: I.Map;
  match: Match | null;
}

const SeriesBox = ({ map, match }: Props) => {
    const amountOfMaps = (match && Math.floor(Number(match.matchType.substr(-1)) / 2) + 1) || 0;
    const left = map.team_ct.orientation === "left" ? map.team_ct : map.team_t;
    const right = map.team_ct.orientation === "left" ? map.team_t : map.team_ct;
    return (
      <div id="series_overlay">
        <div className="series_track left">
          {new Array(amountOfMaps).fill(0).map((_, i) => (
            <div key={i} className={`wins_box win ${left.side}`} />
          ))}
        </div>
        <div className="series_track right">
          {new Array(amountOfMaps).fill(0).map((_, i) => (
            <div key={i} className={`wins_box ${right.matches_won_this_series > i ? "win" : ""} ${right.side}`} />
          ))}
        </div>
      </div>
    );
}

export default SeriesBox;