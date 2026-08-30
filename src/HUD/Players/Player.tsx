import * as I from "csgogsi";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import Armor from "./../Indicators/Armor";
import Bomb from "./../Indicators/Bomb";
import Defuse from "./../Indicators/Defuse";
import { Skull, Kill } from "./../../assets/Icons";
import React from "react";

interface IProps {
  player: I.Player,
  isObserved: boolean,
}

const compareWeapon = (weaponOne: I.WeaponRaw, weaponTwo: I.WeaponRaw) => {
  if (weaponOne.name === weaponTwo.name &&
    weaponOne.paintkit === weaponTwo.paintkit &&
    weaponOne.type === weaponTwo.type &&
    weaponOne.ammo_clip === weaponTwo.ammo_clip &&
    weaponOne.ammo_clip_max === weaponTwo.ammo_clip_max &&
    weaponOne.ammo_reserve === weaponTwo.ammo_reserve &&
    weaponOne.state === weaponTwo.state
  ) return true;

  return false;
}

const compareWeapons = (weaponsObjectOne: I.Weapon[], weaponsObjectTwo: I.Weapon[]) => {
  const weaponsOne = [...weaponsObjectOne].sort((a, b) => a.name.localeCompare(b.name))
  const weaponsTwo = [...weaponsObjectTwo].sort((a, b) => a.name.localeCompare(b.name))

  if (weaponsOne.length !== weaponsTwo.length) return false;

  return weaponsOne.every((weapon, i) => compareWeapon(weapon, weaponsTwo[i]));
}

const arePlayersEqual = (playerOne: I.Player, playerTwo: I.Player) => {
  if (playerOne.name === playerTwo.name &&
    playerOne.steamid === playerTwo.steamid &&
    playerOne.observer_slot === playerTwo.observer_slot &&
    playerOne.defaultName === playerTwo.defaultName &&
    playerOne.clan === playerTwo.clan &&
    playerOne.stats.kills === playerTwo.stats.kills &&
    playerOne.stats.assists === playerTwo.stats.assists &&
    playerOne.stats.deaths === playerTwo.stats.deaths &&
    playerOne.stats.mvps === playerTwo.stats.mvps &&
    playerOne.stats.score === playerTwo.stats.score &&
    playerOne.state.health === playerTwo.state.health &&
    playerOne.state.armor === playerTwo.state.armor &&
    playerOne.state.helmet === playerTwo.state.helmet &&
    playerOne.state.defusekit === playerTwo.state.defusekit &&
    playerOne.state.flashed === playerTwo.state.flashed &&
    playerOne.state.smoked === playerTwo.state.smoked &&
    playerOne.state.burning === playerTwo.state.burning &&
    playerOne.state.money === playerTwo.state.money &&
    playerOne.state.round_killhs === playerTwo.state.round_killhs &&
    playerOne.state.round_kills === playerTwo.state.round_kills &&
    playerOne.state.round_totaldmg === playerTwo.state.round_totaldmg &&
    playerOne.state.equip_value === playerTwo.state.equip_value &&
    playerOne.state.adr === playerTwo.state.adr &&
    playerOne.avatar === playerTwo.avatar &&
    !!playerOne.team.id === !!playerTwo.team.id &&
    playerOne.team.side === playerTwo.team.side &&
    playerOne.country === playerTwo.country &&
    playerOne.realName === playerTwo.realName &&
    compareWeapons(playerOne.weapons, playerTwo.weapons)
  ) return true;

  return false;
}
const Player = ({ player, isObserved }: IProps) => {

  const weapons = player.weapons.map(weapon => ({ ...weapon, name: weapon.name.replace("weapon_", "") }));
  const primary = weapons.filter(weapon => !['C4', 'Pistol', 'Knife', 'Grenade', undefined].includes(weapon.type))[0] || null;
  const secondary = weapons.filter(weapon => weapon.type === "Pistol")[0] || null;
  const grenades = weapons.filter(weapon => weapon.type === "Grenade");
  const isLeft = player.team.orientation === "left";
  const isDead = player.state.health === 0;

  return (
    <div className={`player ${isDead ? "dead" : ""} ${isObserved ? 'active' : ''}`}>
      <div className="player_data">
        {isDead
          ? <Skull className="dead_skull_bg" />
          : <Avatar teamId={player.team.id} steamid={player.steamid} url={player.avatar} height={70} width={70} showSkull={false} showCam={false} sidePlayer={true} />}
        <div className="player_stats">
          <div className="row top">
            <div className="username">
              <div>{isLeft ? <span>{player.observer_slot}</span> : null} {player.name} {!isLeft ? <span>{player.observer_slot}</span> : null}</div>
              {isDead ? <div className="money">${player.state.money}</div> : null}
              {player.state.round_kills ? <div className="roundkills-container"><span className="roundkills-icon"></span><span className="roundkills-value">+{player.state.round_kills}</span></div> : null}
            </div>
            {isDead ? (
              <div className="dead-stats">
                <div className="dead-stat"><span className="stat-value">{player.stats.kills}</span><span className="stat-label">K</span></div>
                <div className="dead-stat"><span className="stat-value">{player.stats.assists}</span><span className="stat-label">A</span></div>
                <div className="dead-stat"><span className="stat-value">{player.stats.deaths}</span><span className="stat-label">D</span></div>
              </div>
            ) : (
              <div className="kd_stats">
                <div className="kd_item kills"><Kill /><span className="kd_value">{player.stats.kills}</span></div>
                <div className="kd_item deaths"><Skull /><span className="kd_value">{player.stats.deaths}</span></div>
              </div>
            )}
          </div>
          {!isDead && (
            <>
              <div className="row middle">
                <div className="money">${player.state.money}</div>
                <div className="grenades">
                  {grenades.map(grenade => (
                    [
                      <Weapon key={`${grenade.name}-${grenade.state}`} weapon={grenade.name} active={grenade.state === "active"} isGrenade />,
                      grenade.ammo_reserve === 2 ? <Weapon key={`${grenade.name}-${grenade.state}-double`} weapon={grenade.name} active={false} isGrenade /> : null,
                    ]
                  ))}
                </div>
                <div className="armor_and_utility">
                  <Bomb player={player} />
                  <Defuse player={player} />
                </div>
              </div>
              <div className={`health_bar_row ${player.state.health <= 20 ? 'low' : ''}`}>
                <div className="health_bar_fill" style={{ width: `${player.state.health}%` }}></div>
                <div className="health_bar_content">
                  <span className="hp_value">{player.state.health}</span>
                  <Armor health={player.state.health} armor={player.state.armor} helmet={player.state.helmet} />
                </div>
                {primary || secondary ? <Weapon className="bottom_weapon" weapon={primary ? primary.name : secondary.name} active={primary ? primary.state === "active" : secondary.state === "active"} /> : null}
              </div>
            </>
          )}
          <div className="active_border"></div>
        </div>
      </div>
    </div>
  );
}

const arePropsEqual = (prevProps: Readonly<IProps>, nextProps: Readonly<IProps>) => {
  if (prevProps.isObserved !== nextProps.isObserved) return false;

  return arePlayersEqual(prevProps.player, nextProps.player);
}

export default React.memo(Player, arePropsEqual);
//export default Player;
