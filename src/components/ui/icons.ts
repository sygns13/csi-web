// Registro de íconos Lucide usados en el sitio (ISC). Agregar aquí cada ícono nuevo.
import ArrowRight from "@lucide/astro/icons/arrow-right";
import BadgeCheck from "@lucide/astro/icons/badge-check";
import Bot from "@lucide/astro/icons/bot";
import BrainCircuit from "@lucide/astro/icons/brain-circuit";
import ChevronDown from "@lucide/astro/icons/chevron-down";
import CloudCog from "@lucide/astro/icons/cloud-cog";
import CodeXml from "@lucide/astro/icons/code-xml";
import ExternalLink from "@lucide/astro/icons/external-link";
import Globe from "@lucide/astro/icons/globe";
import Keyboard from "@lucide/astro/icons/keyboard";
import LayoutDashboard from "@lucide/astro/icons/layout-dashboard";
import Lightbulb from "@lucide/astro/icons/lightbulb";
import Mail from "@lucide/astro/icons/mail";
import Menu from "@lucide/astro/icons/menu";
import Monitor from "@lucide/astro/icons/monitor";
import Moon from "@lucide/astro/icons/moon";
import Network from "@lucide/astro/icons/network";
import Package from "@lucide/astro/icons/package";
import Phone from "@lucide/astro/icons/phone";
import Printer from "@lucide/astro/icons/printer";
import Router from "@lucide/astro/icons/router";
import Server from "@lucide/astro/icons/server";
import Sun from "@lucide/astro/icons/sun";
import Video from "@lucide/astro/icons/video";
import X from "@lucide/astro/icons/x";

export const icons = {
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  bot: Bot,
  "brain-circuit": BrainCircuit,
  "chevron-down": ChevronDown,
  "cloud-cog": CloudCog,
  "code-xml": CodeXml,
  "external-link": ExternalLink,
  globe: Globe,
  keyboard: Keyboard,
  "layout-dashboard": LayoutDashboard,
  lightbulb: Lightbulb,
  mail: Mail,
  menu: Menu,
  monitor: Monitor,
  moon: Moon,
  network: Network,
  package: Package,
  phone: Phone,
  printer: Printer,
  router: Router,
  server: Server,
  sun: Sun,
  video: Video,
  x: X,
} as const;

export type IconName = keyof typeof icons;

export const isIconName = (value: string): value is IconName => value in icons;
