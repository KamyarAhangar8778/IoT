import React from "react";
import * as System from "./MonoSystemIcons";
import * as Weather from "./MonoWeatherIcons";
import * as Device from "./MonoDeviceIcons";
import * as Media from "./MonoMediaIcons";
import * as Action from "./MonoActionIcons";
import { ICON_MAP } from "@/features/iot/utils/icons";

interface MonoAnimatedIconProps {
  iconName: string;
  className?: string;
  animationsEnabled?: boolean;
}

const MONO_COMPONENT_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu: System.AnimCpu,
  Power: System.AnimPower,
  Zap: System.AnimZap,
  Settings: System.AnimSettings,
  Server: System.AnimServer,
  Battery: System.AnimBattery,
  BatteryFull: System.AnimBatteryFull,
  Activity: System.AnimActivity,
  Lock: System.AnimLock,
  Unlock: System.AnimUnlock,
  Key: System.AnimKey,
  Shield: System.AnimShield,

  Sun: Weather.AnimSun,
  Moon: Weather.AnimMoon,
  Cloud: Weather.AnimCloud,
  Wind: Weather.AnimWind,
  Flame: Weather.AnimFlame,
  Snowflake: Weather.AnimSnowflake,
  Waves: Weather.AnimWaves,
  Droplet: Weather.AnimDroplet,
  Droplets: Weather.AnimDroplets,
  Thermometer: Weather.AnimThermometer,
  ThermometerSun: Weather.AnimThermometerSun,

  Fan: Device.AnimFan,
  Lightbulb: Device.AnimLightbulb,
  Clock: Device.AnimClock,
  Timer: Device.AnimTimer,
  Bell: Device.AnimBell,
  Camera: Device.AnimCamera,
  Video: Device.AnimVideo,
  Tv: Device.AnimTv,
  Monitor: Device.AnimMonitor,
  Smartphone: Device.AnimSmartphone,
  Phone: Device.AnimPhone,

  Speaker: Media.AnimSpeaker,
  Volume2: Media.AnimVolume2,
  Mic: Media.AnimMic,
  Music: Media.AnimMusic,
  Radio: Media.AnimRadio,
  Airplay: Media.AnimAirplay,
  Wifi: Media.AnimWifi,
  Bluetooth: Media.AnimBluetooth,
  Gamepad2: Media.AnimGamepad2,
  Coffee: Media.AnimCoffee,

  Car: Action.AnimCar,
  Eye: Action.AnimEye,
  Sprout: Action.AnimSprout,
  Leaf: Action.AnimLeaf,
  Home: Action.AnimHome,
  MapPin: Action.AnimMapPin,
  Book: Action.AnimBook,
  Layers: Action.AnimLayers,
  Play: Action.AnimPlay,
  Pause: Action.AnimPause,
  Square: Action.AnimSquare,
  Check: Action.AnimCheck,
  RefreshCw: Action.AnimRefreshCw,
  X: Action.AnimX,
  Menu: Action.AnimMenu,
  Search: Action.AnimSearch,
};

/**
 * Renders segmented multi-part animated SVG monochrome stickers
 * with calm, slow, blur-free micro-animations.
 */
export default function MonoAnimatedIcon({
  iconName,
  className = "w-4 h-4",
  animationsEnabled = true,
}: MonoAnimatedIconProps) {
  if (!animationsEnabled) {
    const FallbackLucide = ICON_MAP[iconName] || ICON_MAP["Cpu"];
    return <FallbackLucide className={className} />;
  }

  const Component = MONO_COMPONENT_MAP[iconName];

  if (Component) {
    return <Component className={className} />;
  }

  // Fallback to static Lucide icon if not specialized
  const FallbackLucide = ICON_MAP[iconName] || ICON_MAP["Cpu"];
  return <FallbackLucide className={`${className} animate-[pulse_3s_ease-in-out_infinite]`} />;
}
