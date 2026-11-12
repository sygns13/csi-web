// Registro de íconos Lucide usados en el sitio (ISC). Para agregar uno: su nombre en `icon-names.ts`
// y su componente aquí (el `satisfies` obliga a que ambas listas coincidan).
import Accessibility from "@lucide/astro/icons/accessibility";
import ArrowLeft from "@lucide/astro/icons/arrow-left";
import ArrowRight from "@lucide/astro/icons/arrow-right";
import Award from "@lucide/astro/icons/award";
import BadgeCheck from "@lucide/astro/icons/badge-check";
import Bot from "@lucide/astro/icons/bot";
import BrainCircuit from "@lucide/astro/icons/brain-circuit";
import Briefcase from "@lucide/astro/icons/briefcase";
import Calculator from "@lucide/astro/icons/calculator";
import Check from "@lucide/astro/icons/check";
import ChevronDown from "@lucide/astro/icons/chevron-down";
import CircleCheck from "@lucide/astro/icons/circle-check";
import CircleExclamationPoint from "@lucide/astro/icons/circle-exclamation-point";
import Cloud from "@lucide/astro/icons/cloud";
import CloudCog from "@lucide/astro/icons/cloud-cog";
import CodeXml from "@lucide/astro/icons/code-xml";
import ExternalLink from "@lucide/astro/icons/external-link";
import Eye from "@lucide/astro/icons/eye";
import FileText from "@lucide/astro/icons/file-text";
import Globe from "@lucide/astro/icons/globe";
import Handshake from "@lucide/astro/icons/handshake";
import Headset from "@lucide/astro/icons/headset";
import HeartHandshake from "@lucide/astro/icons/heart-handshake";
import ImageIcon from "@lucide/astro/icons/image";
import Keyboard from "@lucide/astro/icons/keyboard";
import Landmark from "@lucide/astro/icons/landmark";
import Layers from "@lucide/astro/icons/layers";
import LayoutDashboard from "@lucide/astro/icons/layout-dashboard";
import Lightbulb from "@lucide/astro/icons/lightbulb";
import ListChecks from "@lucide/astro/icons/list-checks";
import Lock from "@lucide/astro/icons/lock";
import Mail from "@lucide/astro/icons/mail";
import Menu from "@lucide/astro/icons/menu";
import Monitor from "@lucide/astro/icons/monitor";
import Moon from "@lucide/astro/icons/moon";
import Network from "@lucide/astro/icons/network";
import Package from "@lucide/astro/icons/package";
import PenLine from "@lucide/astro/icons/pen-line";
import Phone from "@lucide/astro/icons/phone";
import Printer from "@lucide/astro/icons/printer";
import Router from "@lucide/astro/icons/router";
import Search from "@lucide/astro/icons/search";
import Send from "@lucide/astro/icons/send";
import Server from "@lucide/astro/icons/server";
import Share2 from "@lucide/astro/icons/share-2";
import ShieldCheck from "@lucide/astro/icons/shield-check";
import Sparkles from "@lucide/astro/icons/sparkles";
import Sun from "@lucide/astro/icons/sun";
import Target from "@lucide/astro/icons/target";
import Video from "@lucide/astro/icons/video";
import Wrench from "@lucide/astro/icons/wrench";
import X from "@lucide/astro/icons/x";
import type { IconName } from "./icon-names";

export { iconNames, isIconName, type IconName } from "./icon-names";

export const icons = {
  accessibility: Accessibility,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  award: Award,
  "badge-check": BadgeCheck,
  bot: Bot,
  "brain-circuit": BrainCircuit,
  briefcase: Briefcase,
  calculator: Calculator,
  check: Check,
  "chevron-down": ChevronDown,
  "circle-check": CircleCheck,
  "circle-exclamation-point": CircleExclamationPoint,
  cloud: Cloud,
  "cloud-cog": CloudCog,
  "code-xml": CodeXml,
  "external-link": ExternalLink,
  eye: Eye,
  "file-text": FileText,
  globe: Globe,
  handshake: Handshake,
  headset: Headset,
  "heart-handshake": HeartHandshake,
  image: ImageIcon,
  keyboard: Keyboard,
  landmark: Landmark,
  layers: Layers,
  "layout-dashboard": LayoutDashboard,
  lightbulb: Lightbulb,
  "list-checks": ListChecks,
  lock: Lock,
  mail: Mail,
  menu: Menu,
  monitor: Monitor,
  moon: Moon,
  network: Network,
  package: Package,
  "pen-line": PenLine,
  phone: Phone,
  printer: Printer,
  router: Router,
  search: Search,
  send: Send,
  server: Server,
  "share-2": Share2,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  sun: Sun,
  target: Target,
  video: Video,
  wrench: Wrench,
  x: X,
} satisfies Record<IconName, typeof ArrowRight>;
