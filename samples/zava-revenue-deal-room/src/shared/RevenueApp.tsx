import * as React from "react";
import {
  Badge,
  Button,
  Spinner,
  makeStyles,
  mergeClasses,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowExpand20Regular,
  Chat20Regular,
  DataTrending20Regular,
  Money20Regular,
  PeopleTeam20Regular,
  ShieldCheckmark20Regular,
  TargetArrow20Regular,
} from "@fluentui/react-icons";
import type {
  IIntentDefinition,
  IRevenueProperties,
  RevenueLens,
} from "./catalog";
import { LENS_LABELS } from "./catalog";
import {
  CONTACTS,
  HERO_EVIDENCE,
  HERO_MILESTONES,
  calculateCommercialOffer,
  type EvidenceKind,
} from "./domain";
import { PERSONA_MEDIA } from "./media";
import { ZAVAMESH } from "./brand";
import DealOperations, { useDealOperationsSession } from "./DealOperations";
import RevenueDashboard from "./RevenueDashboard";
import RevenueExperiences from "./RevenueExperiences";
import { resolveScope } from "./operations";
import { D3ForecastBridge } from "./visualizations/RevenueCharts";

export interface IModelContextSnapshot extends Record<string, unknown> {
  readonly intent: string;
  readonly displayMode: string;
  readonly route: string;
  readonly selectedEntityId: string;
  readonly workflowStage: string;
  readonly summary: string;
  readonly availableActions: readonly string[];
}

export interface IRevenueAppProps {
  readonly definition: IIntentDefinition;
  readonly properties: IRevenueProperties;
  readonly currentUserName: string;
  readonly displayMode?: string;
  readonly onRequestFullscreen?: () => Promise<void>;
  readonly onUpdateModelContext: (
    snapshot: IModelContextSnapshot,
  ) => Promise<void>;
  readonly onSendFollowUp: (message: string) => Promise<boolean>;
  readonly visibleWorkspaceLens?: RevenueLens;
  readonly referenceEvidenceId?: string;
  readonly referenceRegion?: string;
  readonly workspaceState?: Readonly<Record<string, unknown>>;
}

const fadeInUp = {
  from: { opacity: 0, transform: "translateY(10px)" },
  to: { opacity: 1, transform: "translateY(0)" },
};
const useStyles = makeStyles({
  app: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    backgroundImage: `linear-gradient(145deg, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorNeutralBackground2} 100%)`,
    overflow: "hidden",
  },
  inline: {
    maxWidth: "760px",
    minHeight: "360px",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    boxShadow: tokens.shadow16,
  },
  full: { minHeight: "100vh" },
  brandLine: {
    height: "4px",
    backgroundImage: `linear-gradient(90deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackgroundHover} 40%, ${tokens.colorPaletteLightGreenBackground3} 75%, ${tokens.colorPaletteYellowBackground3} 100%)`,
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalM,
    minWidth: 0,
    maxWidth: "100%",
    padding: `${tokens.spacingVerticalL} ${tokens.spacingHorizontalXL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    "@media (max-width: 420px)": {
      padding: tokens.spacingVerticalM,
      flexDirection: "column",
    },
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalXS,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
  },
  title: {
    margin: `${tokens.spacingVerticalXS} 0`,
    fontFamily: "Aptos Display, Segoe UI, sans-serif",
    fontSize: tokens.fontSizeHero800,
    lineHeight: tokens.lineHeightHero800,
    letterSpacing: "-0.7px",
    outlineStyle: "none",
    "@media (max-width: 420px)": {
      fontSize: tokens.fontSizeHero700,
      lineHeight: tokens.lineHeightHero700,
    },
  },
  inlineTitle: {
    fontSize: tokens.fontSizeHero700,
    lineHeight: tokens.lineHeightHero700,
  },
  subtitle: {
    margin: 0,
    maxWidth: "640px",
    minWidth: 0,
    overflowWrap: "break-word",
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase300,
    lineHeight: tokens.lineHeightBase300,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalM,
    flexShrink: 0,
    "@media (max-width: 520px)": {
      width: "100%",
      justifyContent: "space-between",
    },
  },
  iconButton: { flexShrink: 0, boxShadow: tokens.shadow4 },
  shell: {
    display: "grid",
    width: "100%",
    minWidth: 0,
    gridTemplateColumns: "216px minmax(0, 1fr)",
    minHeight: "calc(100vh - 5px)",
    "@media (max-width: 760px)": { gridTemplateColumns: "minmax(0, 1fr)" },
  },
  rail: {
    minWidth: 0,
    maxWidth: "100%",
    padding: tokens.spacingVerticalXL,
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    backgroundImage: `url(${ZAVAMESH.meshWave}), linear-gradient(165deg, ${tokens.colorBrandBackgroundPressed} 0%, ${tokens.colorBrandBackgroundHover} 62%, ${tokens.colorBrandBackground} 100%)`,
    backgroundSize: "auto 480px, cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center bottom, center",
    borderRight: `1px solid ${tokens.colorNeutralStrokeOnBrand2}`,
    boxShadow: tokens.shadow16,
    "@media (max-width: 760px)": {
      padding: tokens.spacingVerticalS,
      borderRight: 0,
      borderBottom: `1px solid ${tokens.colorNeutralStrokeOnBrand2}`,
    },
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    fontWeight: tokens.fontWeightBold,
    marginBottom: tokens.spacingVerticalXXL,
    "@media (max-width: 760px)": { marginBottom: tokens.spacingVerticalM },
  },
  wordmark: { width: "154px", height: "30px", objectFit: "contain", objectPosition: "left center" },
  inlineWordmark: { width: "162px", height: "30px", objectFit: "contain", objectPosition: "left center", marginBottom: tokens.spacingVerticalS },
  railCaption: { fontSize: tokens.fontSizeBase100, letterSpacing: "1.4px", opacity: 0.8, marginBottom: tokens.spacingVerticalM },
  railFooter: { marginTop: tokens.spacingVerticalXXXL, paddingTop: tokens.spacingVerticalL, borderTop: `1px solid ${tokens.colorNeutralStrokeOnBrand2}`, fontSize: tokens.fontSizeBase200, lineHeight: tokens.lineHeightBase300, "@media (max-width: 760px)": { display: "none" } },
  heroPhoto: { width: "78px", height: "96px", objectFit: "cover", objectPosition: "center 65%", borderRadius: tokens.borderRadiusMedium, gridRow: "1 / span 3" },
  specialistHeading: { marginTop: tokens.spacingVerticalXXXL, paddingTop: tokens.spacingVerticalXL, borderTop: `1px solid ${tokens.colorNeutralStroke2}` },
  brandMark: {
    display: "grid",
    placeItems: "center",
    width: "38px",
    height: "38px",
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorPaletteMarigoldBackground2,
    boxShadow: tokens.shadow8,
  },
  nav: {
    display: "flex",
    minWidth: 0,
    maxWidth: "100%",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    "@media (max-width: 760px)": {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
  },
  navButton: {
    justifyContent: "flex-start",
    width: "100%",
    minWidth: 0,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  navActive: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
  },
  main: { width: "100%", minWidth: 0, maxWidth: "100%" },
  content: {
    padding: `${tokens.spacingVerticalXL} ${tokens.spacingHorizontalXXL}`,
    animationName: fadeInUp,
    animationDuration: "240ms",
    animationTimingFunction: tokens.curveEasyEase,
    "@media (max-width: 760px)": { padding: tokens.spacingVerticalM },
    "@media (prefers-reduced-motion: reduce)": { animationDuration: "0.01ms" },
  },
  heroBand: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.6fr) minmax(230px, .7fr)",
    gap: tokens.spacingHorizontalXL,
    padding: tokens.spacingVerticalXL,
    color: tokens.colorNeutralForegroundOnBrand,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorBrandBackground,
    backgroundImage: `url(${ZAVAMESH.meshWave}), linear-gradient(120deg, ${tokens.colorBrandBackgroundPressed} 0%, ${tokens.colorBrandBackgroundHover} 60%, ${tokens.colorBrandBackground} 100%)`,
    backgroundSize: "cover",
    border: `1px solid ${tokens.colorNeutralStrokeOnBrand2}`,
    boxShadow: tokens.shadow16,
    "@media (max-width: 760px)": { gridTemplateColumns: "1fr" },
  },
  heroValue: {
    fontFamily: "Aptos Display, Segoe UI, sans-serif",
    fontSize: tokens.fontSizeHero900,
    lineHeight: tokens.lineHeightHero900,
    fontWeight: tokens.fontWeightBold,
    margin: 0,
  },
  heroSubtitle: {
    margin: 0,
    color: tokens.colorNeutralForegroundOnBrand,
    opacity: 0.84,
  },
  heroMeta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
  },
  scoreBlock: {
    display: "grid",
    gridTemplateColumns: "78px minmax(0, 1fr)",
    alignItems: "center",
    columnGap: tokens.spacingHorizontalM,
    borderLeft: `1px solid ${tokens.colorNeutralStrokeOnBrand2}`,
    paddingLeft: tokens.spacingHorizontalXL,
    "@media (max-width: 760px)": {
      borderLeft: 0,
      borderTop: `1px solid ${tokens.colorNeutralStrokeOnBrand2}`,
      paddingLeft: 0,
      paddingTop: tokens.spacingVerticalM,
    },
  },
  score: {
    fontSize: tokens.fontSizeHero800,
    lineHeight: tokens.lineHeightHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForegroundOnBrand,
    textShadow: tokens.shadow4,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.35fr) minmax(240px, .65fr)",
    gap: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalL,
    "@media (max-width: 760px)": { gridTemplateColumns: "1fr" },
  },
  gridSingle: { gridTemplateColumns: "minmax(0, 1fr)" },
  dashboardCharts: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: tokens.spacingHorizontalL,
    marginTop: tokens.spacingVerticalL,
    "@media (max-width: 980px)": { gridTemplateColumns: "1fr" },
  },
  visualStack: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
  },
  workspace: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: tokens.spacingVerticalL,
    marginTop: tokens.spacingVerticalL,
  },
  workspaceGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.45fr) minmax(300px, .7fr)",
    gap: tokens.spacingHorizontalL,
    "@media (max-width: 980px)": { gridTemplateColumns: "1fr" },
  },
  workspaceGridEqual: {
    display: "grid",
    gap: tokens.spacingHorizontalL,
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    "@media (max-width: 980px)": { gridTemplateColumns: "1fr" },
  },
  workspaceList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  workspaceRow: {
    display: "grid",
    gridTemplateColumns: "38px minmax(0, 1fr) auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    minHeight: "58px",
    padding: tokens.spacingVerticalS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
  },
  workspaceRowSelected: {
    borderRadius: tokens.borderRadiusSmall,
    backgroundImage: `linear-gradient(90deg, ${tokens.colorBrandBackground2}, ${tokens.colorPaletteMarigoldBackground1})`,
    boxShadow: `inset 4px 0 0 ${tokens.colorBrandStroke1}`,
  },
  rowValue: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: tokens.spacingVerticalXXS,
    fontVariantNumeric: "tabular-nums",
  },
  priorityNumber: {
    display: "grid",
    placeItems: "center",
    width: "30px",
    height: "30px",
    borderRadius: tokens.borderRadiusCircular,
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    fontWeight: tokens.fontWeightBold,
  },
  actionBand: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: tokens.spacingHorizontalS,
    "@media (max-width: 680px)": { gridTemplateColumns: "1fr" },
  },
  actionTile: {
    minWidth: 0,
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundImage: `linear-gradient(135deg, ${tokens.colorNeutralBackground1}, ${tokens.colorBrandBackground2})`,
  },
  policyBand: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: tokens.spacingHorizontalS,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
    backgroundImage: `linear-gradient(115deg, ${tokens.colorBrandBackground2}, ${tokens.colorPaletteMarigoldBackground1})`,
    "@media (max-width: 680px)": { gridTemplateColumns: "1fr" },
  },
  policyItem: {
    padding: tokens.spacingVerticalS,
    borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
  },
  focusedModule: {
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  panel: {
    minWidth: 0,
    padding: tokens.spacingVerticalL,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
    "@media (max-width: 420px)": { padding: tokens.spacingVerticalM },
  },
  panelWarm: { borderTopColor: tokens.colorPaletteRedBorder2 },
  panelGreen: { borderTopColor: tokens.colorPaletteGreenBorder2 },
  panelTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
  },
  heading: {
    margin: 0,
    fontSize: tokens.fontSizeBase500,
    lineHeight: tokens.lineHeightBase500,
  },
  subheading: {
    margin: 0,
    fontSize: tokens.fontSizeBase400,
    lineHeight: tokens.lineHeightBase400,
  },
  insight: {
    margin: `${tokens.spacingVerticalS} 0 0`,
    color: tokens.colorNeutralForeground2,
    lineHeight: tokens.lineHeightBase300,
  },
  evidenceList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  evidence: {
    display: "grid",
    gridTemplateColumns: "10px 34px minmax(0, 1fr) auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    padding: `${tokens.spacingVerticalS} 0`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  evidenceButton: {
    textAlign: "left",
    border: 0,
    backgroundColor: "transparent",
    color: tokens.colorNeutralForeground1,
    cursor: "pointer",
    padding: 0,
  },
  evidenceSelected: { color: tokens.colorBrandForeground1 },
  dot: {
    width: "9px",
    height: "9px",
    marginTop: tokens.spacingVerticalXS,
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralForeground3,
  },
  verified: { backgroundColor: tokens.colorPaletteGreenForeground1 },
  contrary: { backgroundColor: tokens.colorPaletteRedForeground1 },
  inference: { backgroundColor: tokens.colorPaletteMarigoldForeground2 },
  stale: { backgroundColor: tokens.colorNeutralForeground4 },
  judgment: { backgroundColor: tokens.colorBrandForeground1 },
  calculation: { backgroundColor: tokens.colorPaletteBerryForeground2 },
  tiny: {
    display: "block",
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  profileCopy: {
    display: "flex",
    flexDirection: "column",
    "@media (max-width: 600px)": { display: "none" },
  },
  avatar: {
    width: "34px",
    height: "34px",
    flexShrink: 0,
    borderRadius: tokens.borderRadiusCircular,
    objectFit: "cover",
    border: `2px solid ${tokens.colorNeutralBackground1}`,
    boxShadow: tokens.shadow4,
  },
  avatarSmall: { width: "28px", height: "28px" },
  avatarLarge: {
    width: "58px",
    height: "58px",
    border: `3px solid ${tokens.colorNeutralForegroundOnBrand}`,
    boxShadow: tokens.shadow16,
  },
  avatarFallback: {
    display: "grid",
    placeItems: "center",
    color: tokens.colorNeutralForegroundOnBrand,
    backgroundColor: tokens.colorBrandBackground,
    fontWeight: tokens.fontWeightBold,
  },
  avatarStack: {
    display: "flex",
    alignItems: "center",
    paddingLeft: tokens.spacingHorizontalS,
  },
  avatarStackItem: { marginLeft: "-9px" },
  teamLabel: {
    color: tokens.colorNeutralForegroundOnBrand,
    opacity: 0.82,
    fontSize: tokens.fontSizeBase100,
  },
  personIdentity: {
    display: "flex",
    minWidth: 0,
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
  },
  orbit: { width: "100%", height: "270px", display: "block" },
  orbitLine: { stroke: tokens.colorNeutralStroke1, strokeWidth: 2 },
  orbitStrong: { stroke: tokens.colorBrandStroke1, strokeWidth: 4 },
  orbitNode: {
    fill: tokens.colorNeutralBackground1,
    stroke: tokens.colorBrandStroke1,
    strokeWidth: 3,
  },
  orbitRisk: {
    fill: tokens.colorPaletteRedBackground2,
    stroke: tokens.colorPaletteRedBorder2,
    strokeWidth: 3,
  },
  orbitChampion: {
    fill: tokens.colorPaletteGreenBackground2,
    stroke: tokens.colorPaletteGreenBorder2,
    strokeWidth: 3,
  },
  orbitLabel: {
    fill: tokens.colorNeutralForeground1,
    fontSize: "12px",
    fontWeight: tokens.fontWeightSemibold,
  },
  runway: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalXL,
  },
  runwayLine: {
    position: "absolute",
    left: "10px",
    top: "12px",
    bottom: "12px",
    width: "3px",
    backgroundColor: tokens.colorBrandBackground,
  },
  milestone: {
    position: "relative",
    display: "grid",
    gridTemplateColumns: "34px minmax(0, 1fr) auto",
    gap: tokens.spacingHorizontalS,
    alignItems: "center",
    padding: tokens.spacingVerticalS,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow2,
  },
  milestoneMarker: {
    position: "absolute",
    left: "-25px",
    top: "16px",
    width: "11px",
    height: "11px",
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground,
    border: `2px solid ${tokens.colorNeutralBackground1}`,
  },
  controls: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: tokens.spacingHorizontalM,
    "@media (max-width: 420px)": { gridTemplateColumns: "1fr" },
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
  },
  metrics: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
    "@media (max-width: 420px)": { gridTemplateColumns: "1fr" },
  },
  metric: {
    padding: tokens.spacingVerticalM,
    border: `1px solid ${tokens.colorNeutralStroke3}`,
    borderLeft: `4px solid ${tokens.colorBrandStroke1}`,
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorNeutralBackground1,
    backgroundImage: `linear-gradient(120deg, ${tokens.colorNeutralBackground1}, ${tokens.colorBrandBackground2})`,
    boxShadow: tokens.shadow2,
  },
  metricValue: {
    display: "block",
    fontSize: tokens.fontSizeBase600,
    lineHeight: tokens.lineHeightBase600,
    fontWeight: tokens.fontWeightBold,
  },
  contour: { width: "100%", height: "190px", display: "block" },
  contourAxis: { stroke: tokens.colorNeutralStroke1, strokeWidth: 1 },
  contourBase: {
    stroke: tokens.colorBrandStroke1,
    strokeWidth: 2,
  },
  contourChoice: {
    fill: tokens.colorPaletteGreenBackground2,
    stroke: tokens.colorPaletteGreenBorder2,
    strokeWidth: 3,
  },
  stageBar: {
    display: "flex",
    gap: tokens.spacingHorizontalXS,
    marginBottom: tokens.spacingVerticalL,
  },
  stage: {
    flex: 1,
    height: "5px",
    backgroundColor: tokens.colorNeutralBackground4,
  },
  stageDone: { backgroundColor: tokens.colorPaletteGreenBackground3 },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalL,
  },
  notice: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalM,
    padding: tokens.spacingVerticalS,
    color: tokens.colorNeutralForeground2,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  capabilityGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(220px, .8fr) minmax(0, 1.2fr)",
    gap: tokens.spacingHorizontalL,
    "@media (max-width: 760px)": { gridTemplateColumns: "1fr" },
  },
  scenarioList: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalXS,
    maxHeight: "420px",
    overflowY: "auto",
  },
  scenario: {
    justifyContent: "space-between",
    minHeight: "38px",
    padding: `0 ${tokens.spacingHorizontalS}`,
    textAlign: "left",
    borderBottom: `1px solid ${tokens.colorNeutralStroke3}`,
    borderRadius: tokens.borderRadiusSmall,
  },
  selectedScenario: {
    color: tokens.colorBrandForeground1,
    backgroundColor: tokens.colorBrandBackground2,
    backgroundImage: `linear-gradient(90deg, ${tokens.colorBrandBackground2}, ${tokens.colorPaletteMarigoldBackground1})`,
    boxShadow: `inset 3px 0 0 ${tokens.colorBrandStroke1}`,
  },
  spinner: { minHeight: "280px" },
});

const money = (value: number): string =>
  value >= 1000000
    ? `$${(value / 1000000).toFixed(1)}M`
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
const evidenceClass = (
  styles: ReturnType<typeof useStyles>,
  kind: EvidenceKind,
): string => {
  const classes: Record<EvidenceKind, string> = {
    verified: styles.verified,
    judgment: styles.judgment,
    calculation: styles.calculation,
    inference: styles.inference,
    stale: styles.stale,
    contrary: styles.contrary,
  };
  return mergeClasses(styles.dot, classes[kind]);
};

const lensProfile: Readonly<
  Record<RevenueLens, { readonly name: string; readonly role: string }>
> = {
  "my-deals": { name: "Megan Bowen", role: "Account executive" },
  "deal-room": { name: "Megan Bowen", role: "Global account lead" },
  "commercial-desk": { name: "Miriam Graham", role: "Finance partner" },
  "revenue-command": { name: "Joni Sherman", role: "Chief revenue officer" },
  education: { name: "Megan Bowen", role: "Revenue team" },
};

function Avatar(props: {
  readonly name: string;
  readonly size?: "small" | "large";
  readonly stacked?: boolean;
}): React.ReactElement {
  const styles = useStyles();
  const media = PERSONA_MEDIA[props.name];
  const className = mergeClasses(
    styles.avatar,
    props.size === "small" && styles.avatarSmall,
    props.size === "large" && styles.avatarLarge,
    props.stacked && styles.avatarStackItem,
  );
  if (media)
    return <img className={className} src={media.src} alt={media.alt} />;
  return (
    <span
      className={mergeClasses(className, styles.avatarFallback)}
      aria-label={props.name}
    >
      {props.name
        .split(" ")
        .map((part) => part[0])
        .join("")}
    </span>
  );
}

function AvatarStack(props: {
  readonly names: readonly string[];
}): React.ReactElement {
  const styles = useStyles();
  return (
    <span
      className={styles.avatarStack}
      aria-label={`Deal team: ${props.names.join(", ")}`}
    >
      {props.names.map((name) => (
        <Avatar key={name} name={name} size="small" stacked />
      ))}
    </span>
  );
}

function EvidenceLedger(props: {
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}): React.ReactElement {
  const styles = useStyles();
  return (
    <section className={styles.panel} aria-labelledby="evidence-title">
      <div className={styles.panelTitle}>
        <h2 id="evidence-title" className={styles.heading}>
          Evidence ledger
        </h2>
        <Badge appearance="tint">6 signals</Badge>
      </div>
      <div className={styles.evidenceList}>
        {HERO_EVIDENCE.map((item) => (
          <div className={styles.evidence} key={item.id}>
            <span
              className={evidenceClass(styles, item.kind)}
              aria-hidden="true"
            />
            <Avatar
              name={
                item.kind === "verified"
                  ? "Nestor Wilke"
                  : item.kind === "judgment"
                    ? "Megan Bowen"
                    : item.kind === "contrary"
                      ? "Lee Gu"
                      : "Pradeep Gupta"
              }
              size="small"
            />
            <button
              className={mergeClasses(
                styles.evidenceButton,
                props.selectedId === item.id && styles.evidenceSelected,
              )}
              onClick={() => props.onSelect(item.id)}
            >
              <strong>{item.title}</strong>
              <br />
              <span className={styles.tiny}>
                {item.kind.toUpperCase()} · {item.source}
              </span>
            </button>
            <span className={styles.tiny}>
              {item.ageDays === 0 ? "Now" : `${item.ageDays}d`}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BuyingCommittee(): React.ReactElement {
  const styles = useStyles();
  const id = React.useId();
  const heroContacts = CONTACTS.filter(
    (contact) => contact.accountId === "CONTOSO",
  ).slice(0, 4);
  const champion = PERSONA_MEDIA["Nestor Wilke"].src;
  const technical = PERSONA_MEDIA["Pradeep Gupta"].src;
  const economic = PERSONA_MEDIA["Lee Gu"].src;
  const legal = PERSONA_MEDIA["Patti Fernandez"].src;
  return (
    <section className={styles.panel} aria-labelledby={`${id}-orbit-title`}>
      <div className={styles.panelTitle}>
        <div>
          <h2 id={`${id}-orbit-title`} className={styles.heading}>
            Decision influence
          </h2>
          <p className={styles.insight}>
            Champion strength is high. Economic authority remains one
            introduction away.
          </p>
        </div>
        <PeopleTeam20Regular />
      </div>
      <svg
        className={styles.orbit}
        viewBox="0 0 520 270"
        role="img"
        aria-label="Contoso buying committee influence map"
      >
        <title>Contoso buying committee</title>
        <desc>
          Four customer stakeholders surround the decision, with a missing
          direct path to the economic buyer.
        </desc>
        <defs>
          <clipPath id={`${id}-champion-photo`}>
            <circle cx="105" cy="70" r="38" />
          </clipPath>
          <clipPath id={`${id}-economic-photo`}>
            <circle cx="405" cy="65" r="38" />
          </clipPath>
          <clipPath id={`${id}-technical-photo`}>
            <circle cx="110" cy="215" r="34" />
          </clipPath>
          <clipPath id={`${id}-legal-photo`}>
            <circle cx="410" cy="210" r="34" />
          </clipPath>
        </defs>
        <line
          x1="260"
          y1="135"
          x2="105"
          y2="70"
          className={styles.orbitStrong}
        />
        <line x1="260" y1="135" x2="405" y2="65" className={styles.orbitLine} />
        <line
          x1="260"
          y1="135"
          x2="110"
          y2="215"
          className={styles.orbitLine}
        />
        <line
          x1="260"
          y1="135"
          x2="410"
          y2="210"
          className={styles.orbitLine}
        />
        <circle cx="260" cy="135" r="54" className={styles.orbitNode} />
        <text x="260" y="131" textAnchor="middle" className={styles.orbitLabel}>
          GLOBAL
        </text>
        <text x="260" y="149" textAnchor="middle" className={styles.orbitLabel}>
          EXPANSION
        </text>
        <circle cx="105" cy="70" r="44" className={styles.orbitChampion} />
        <image
          href={champion}
          x="67"
          y="32"
          width="76"
          height="76"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-champion-photo)`}
        />
        <text x="105" y="126" textAnchor="middle" className={styles.orbitLabel}>
          Nestor · Champion
        </text>
        <circle cx="405" cy="65" r="44" className={styles.orbitRisk} />
        <image
          href={economic}
          x="367"
          y="27"
          width="76"
          height="76"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-economic-photo)`}
        />
        <text x="405" y="121" textAnchor="middle" className={styles.orbitLabel}>
          Lee · Economic buyer
        </text>
        <circle cx="110" cy="215" r="40" className={styles.orbitNode} />
        <image
          href={technical}
          x="76"
          y="181"
          width="68"
          height="68"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-technical-photo)`}
        />
        <text x="110" y="267" textAnchor="middle" className={styles.orbitLabel}>
          Pradeep · Security
        </text>
        <circle cx="410" cy="210" r="40" className={styles.orbitNode} />
        <image
          href={legal}
          x="376"
          y="176"
          width="68"
          height="68"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-legal-photo)`}
        />
        <text x="410" y="262" textAnchor="middle" className={styles.orbitLabel}>
          Patti · Legal
        </text>
      </svg>
      <div className={styles.evidenceList}>
        {heroContacts.map((contact) => (
          <div className={styles.evidence} key={contact.id}>
            <span
              className={mergeClasses(
                styles.dot,
                contact.stance === "champion" && styles.verified,
              )}
            />
            <Avatar name={contact.name} size="small" />
            <span>
              <strong>{contact.name}</strong>
              <br />
              <span className={styles.tiny}>
                {contact.role} · {contact.stance}
              </span>
            </span>
            <strong>{contact.influence}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommitmentRunway(): React.ReactElement {
  const styles = useStyles();
  return (
    <section
      className={mergeClasses(styles.panel, styles.panelGreen)}
      aria-labelledby="runway-title"
    >
      <div className={styles.panelTitle}>
        <div>
          <h2 id="runway-title" className={styles.heading}>
            Close runway
          </h2>
          <p className={styles.insight}>
            Security evidence is the critical path. Credible signature: 21-28
            days.
          </p>
        </div>
        <TargetArrow20Regular />
      </div>
      <div className={styles.runway}>
        <span className={styles.runwayLine} aria-hidden="true" />
        {HERO_MILESTONES.map((milestone) => (
          <div className={styles.milestone} key={milestone.id}>
            <span className={styles.milestoneMarker} aria-hidden="true" />
            <Avatar name={milestone.owner} size="small" />
            <span>
              <strong>{milestone.title}</strong>
              <br />
              <span className={styles.tiny}>
                {milestone.side.toUpperCase()} · {milestone.owner}
              </span>
            </span>
            <Badge
              color={
                milestone.status === "complete"
                  ? "success"
                  : milestone.status === "blocked"
                    ? "danger"
                    : milestone.status === "at-risk"
                      ? "warning"
                      : "informative"
              }
            >
              {milestone.status}
            </Badge>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommercialStudio(): React.ReactElement {
  const styles = useStyles();
  const discount = 14;
  const quantity = 860;
  const result = calculateCommercialOffer({
    quantity,
    termMonths: 36,
    discount,
    services: 420000,
    probability: 0.72,
  });
  return (
    <section className={styles.panel} aria-labelledby="commercial-title">
      <div className={styles.panelTitle}>
        <div>
          <h2 id="commercial-title" className={styles.heading}>
            Protected-margin scenario
          </h2>
          <p className={styles.insight}>
            A phased ramp protects adoption while keeping the offer above the
            68% margin guardrail.
          </p>
        </div>
        <Money20Regular />
      </div>
      <p className={styles.insight}>Read-only baseline: 860 users · 36 months · 14% discount · $420,000 services · 72% probability. Compare with the editable specialist scenario below for live economics.</p>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span className={styles.tiny}>CONTRACT VALUE</span>
          <span className={styles.metricValue}>
            {money(result.contractValue)}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.tiny}>GROSS MARGIN</span>
          <span className={styles.metricValue}>
            {result.grossMargin.toFixed(1)}%
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.tiny}>WEIGHTED FORECAST</span>
          <span className={styles.metricValue}>
            {money(result.weightedForecast)}
          </span>
        </div>
        <div className={styles.metric}>
          <span className={styles.tiny}>AUTHORITY</span>
          <strong>{result.authority}</strong>
        </div>
      </div>
    </section>
  );
}

interface IWorkspaceProps {
  readonly definition: IIntentDefinition;
  readonly selectedEvidence: string;
  readonly onSelectEvidence: (id: string) => void;
  readonly selectedRegion: string;
  readonly onSelectRegion: (id: string) => void;
  readonly onWorkspaceStateChange: (state: Readonly<Record<string, unknown>>) => void;
  readonly dealSession: ReturnType<typeof useDealOperationsSession>;
  readonly dashboardState?: Readonly<Record<string, unknown>>;
}

function MyDealsDashboard(props: IWorkspaceProps): React.ReactElement {
  const styles = useStyles();
  const deals = [
    { rank: "1", name: "Contoso Global Expansion", owner: "Megan Bowen", value: "$3.6M", signal: "Sponsor access", tone: "warning" as const },
    { rank: "2", name: "Fabrikam Service Cloud", owner: "Pradeep Gupta", value: "$2.1M", signal: "Proof ready", tone: "success" as const },
    { rank: "3", name: "Northwind Data Estate", owner: "Miriam Graham", value: "$1.4M", signal: "Terms due", tone: "informative" as const },
  ];
  return (
    <div className={styles.workspace} data-layout="my-deals-dashboard">
      <div className={styles.workspaceGrid}>
        <section className={styles.panel} aria-labelledby="seller-focus-title">
          <div className={styles.panelTitle}>
            <div><span className={styles.tiny}>MEGAN&apos;S SELLING DAY</span><h2 id="seller-focus-title" className={styles.heading}>Prioritized deal focus</h2></div>
            <Badge color="warning">3 actions</Badge>
          </div>
          <div className={styles.workspaceList}>{deals.map((deal, index) => <div key={deal.name} className={mergeClasses(styles.workspaceRow, index === 0 && styles.workspaceRowSelected)}><span className={styles.priorityNumber}>{deal.rank}</span><span><strong>{deal.name}</strong><span className={styles.tiny}>{deal.owner} · {deal.signal}</span></span><span className={styles.rowValue}><strong>{deal.value}</strong><Badge color={deal.tone}>{index === 0 ? "Act today" : index === 1 ? "On track" : "This week"}</Badge></span></div>)}</div>
        </section>
        <section className={styles.panel} aria-labelledby="customer-moments-title">
          <div className={styles.panelTitle}><div><span className={styles.tiny}>NEXT 48 HOURS</span><h2 id="customer-moments-title" className={styles.heading}>Customer moments</h2></div><TargetArrow20Regular /></div>
          <div className={styles.workspaceList}>
            <div className={styles.workspaceRow}><Avatar name="Nestor Wilke" /><span><strong>Contoso steering meeting</strong><span className={styles.tiny}>Tomorrow · economic sponsor access</span></span><Badge color="warning">Prep</Badge></div>
            <div className={styles.workspaceRow}><Avatar name="Pradeep Gupta" /><span><strong>Security proof review</strong><span className={styles.tiny}>Today · 2 controls unresolved</span></span><Badge color="danger">At risk</Badge></div>
            <div className={styles.workspaceRow}><Avatar name="Miriam Graham" /><span><strong>Commercial desk</strong><span className={styles.tiny}>Next checkpoint · ramp and payment terms</span></span><Badge>Review</Badge></div>
          </div>
        </section>
      </div>
      <p className={styles.insight}>Illustrative seller priorities and customer moments, not live CRM assignments.</p>
      <DealOperations mode="seller" session={props.dealSession} onStateChange={props.onWorkspaceStateChange} />
    </div>
  );
}

function DealRoomDashboard(props: IWorkspaceProps): React.ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.workspace} data-layout="deal-room-dashboard">
      <div className={styles.workspaceGrid}>
        <BuyingCommittee />
        <EvidenceLedger selectedId={props.selectedEvidence} onSelect={props.onSelectEvidence} />
      </div>
      <div className={styles.workspaceGridEqual}><CommitmentRunway /><D3ForecastBridge /></div>
      <div className={styles.actionBand}>
        <div className={styles.actionTile}><span className={styles.tiny}>WIN STRATEGY</span><strong>Earn CFO access through Nestor</strong><p className={styles.insight}>Executive sponsor: Megan Bowen</p></div>
        <div className={styles.actionTile}><span className={styles.tiny}>PROOF PLAN</span><strong>Close two security controls</strong><p className={styles.insight}>Owner: Pradeep Gupta · 5 days</p></div>
        <div className={styles.actionTile}><span className={styles.tiny}>CLOSE CONDITION</span><strong>Confirm launch dependency</strong><p className={styles.insight}>Buyer checkpoint: 9 days</p></div>
      </div>
    </div>
  );
}

function CommercialDeskDashboard(props: IWorkspaceProps): React.ReactElement {
  const styles = useStyles();
  return (
    <div className={styles.workspace} data-layout="commercial-desk-dashboard">
      <DealOperations mode="reviewer" session={props.dealSession} onStateChange={props.onWorkspaceStateChange} />
      <div className={styles.workspaceGrid}>
        <CommercialStudio />
        <CommitmentRunway />
      </div>
      <section className={styles.policyBand} aria-label="Commercial policy position">
        <div className={styles.policyItem}><span className={styles.tiny}>MARGIN FLOOR</span><strong>68% required</strong><p className={styles.insight}>Reference scenario: {calculateCommercialOffer({ quantity: 860, termMonths: 36, discount: 14, services: 420000, probability: 0.72 }).grossMargin.toFixed(1)}% · review below floor</p></div>
        <div className={styles.policyItem}><span className={styles.tiny}>DISCOUNT AUTHORITY</span><strong>Commercial director</strong><p className={styles.insight}>Executive committee above 18%</p></div>
        <div className={styles.policyItem}><span className={styles.tiny}>TERM EXCEPTION</span><strong>Finance + legal</strong><p className={styles.insight}>Condition required for Net 60</p></div>
      </section>
    </div>
  );
}

function RevenueCommandDashboard(props: IWorkspaceProps): React.ReactElement {
  return <RevenueDashboard onStateChange={props.onWorkspaceStateChange} initialState={props.dashboardState} />;
}

function WorkspaceDashboard(props: IWorkspaceProps): React.ReactElement {
  if (props.definition.lens === "my-deals") return <MyDealsDashboard {...props} />;
  if (props.definition.lens === "deal-room") return <DealRoomDashboard {...props} />;
  if (props.definition.lens === "commercial-desk") return <CommercialDeskDashboard {...props} />;
  if (props.definition.lens === "revenue-command") return <RevenueCommandDashboard {...props} />;
  return <></>;
}

function RevenueContent(
  props: IRevenueAppProps & { readonly fullScreen: boolean; readonly workspaceLens: RevenueLens },
): React.ReactElement {
  const styles = useStyles();
  const [selectedEvidence, setSelectedEvidence] = React.useState("EV-03");
  const [referenceRegion, setReferenceRegion] = React.useState("emea");
  const [followUpState, setFollowUpState] = React.useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [expandError, setExpandError] = React.useState(false);
  const dealSession = useDealOperationsSession();
  const [workspaceStates, setWorkspaceStates] = React.useState<Partial<Record<RevenueLens, Readonly<Record<string, unknown>>>>>({});
  const onWorkspaceStateChange = React.useCallback((state: Readonly<Record<string, unknown>>): void => {
    setWorkspaceStates(current => JSON.stringify(current[props.workspaceLens]) === JSON.stringify(state) ? current : { ...current, [props.workspaceLens]: state });
  }, [props.workspaceLens]);
  const scope = resolveScope(props.properties);
  const showReferenceWorkspace = scope.errors.length === 0 && scope.opportunity?.id === "ZDR-2042";

  const sendFollowUp = async (): Promise<void> => {
    setFollowUpState("sending");
    try {
      const accepted = await props.onSendFollowUp(
        `Help me analyze ${props.definition.title.toLowerCase()} for ${scope.errors.length ? JSON.stringify(props.properties) : `${scope.account?.name} ${scope.opportunity?.id}`}. Use the visible session context; do not execute external actions.`,
      );
      setFollowUpState(accepted ? "sent" : "error");
    } catch {
      setFollowUpState("error");
    }
  };

  const profile = lensProfile[props.fullScreen ? props.workspaceLens : props.definition.lens];
  const workspaceDescriptions: Record<RevenueLens, string> = {
    "my-deals": "Your next growth opportunity, from first proposal to accountable approval.",
    "deal-room": "Bring buyer evidence, decision makers and the critical close path together.",
    "commercial-desk": "Shape the economics. Protect the margin. Put authority behind every decision.",
    "revenue-command": "Connect worldwide pipeline, regional investment and the decisions that move growth.",
    education: props.definition.outcome,
  };
  return (
    <>
      <header className={styles.header}>
        <div>
          {!props.fullScreen && <img className={styles.inlineWordmark} src={ZAVAMESH.colorLogo} alt="ZavaMesh" />}
          <div className={styles.eyebrow}>
            REVENUE DEAL ROOM · {props.fullScreen ? profile.role.toUpperCase() : props.definition.role.toUpperCase()}
          </div>
          <h1
            className={mergeClasses(
              styles.title,
              !props.fullScreen && styles.inlineTitle,
            )}
            tabIndex={-1}
          >
            {props.fullScreen ? LENS_LABELS[props.workspaceLens] : props.definition.title}
          </h1>
          <p className={styles.subtitle}>
            {props.fullScreen ? workspaceDescriptions[props.workspaceLens] : `${props.definition.question} ${props.definition.outcome}`}
          </p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.profile}>
            <Avatar name={profile.name} />
            <span className={styles.profileCopy}>
              <strong>{profile.name}</strong>
              <span className={styles.tiny}>{profile.role}</span>
            </span>
          </div>
          {props.onRequestFullscreen && (
            <Button
              className={styles.iconButton}
              appearance="primary"
              icon={<ArrowExpand20Regular />}
              onClick={() => { props.onRequestFullscreen?.().catch(() => setExpandError(true)); }}
            >
              View in full screen
            </Button>
          )}
        </div>
      </header>
      <div className={styles.content}>
        {props.fullScreen && showReferenceWorkspace && (
          <section className={styles.heroBand}>
            <div>
              <Badge appearance="filled" color="success">
                ZAVAMESH / {props.workspaceLens === "deal-room" ? "CONTOSO · ZDR-2042" : "GLOBAL REVENUE"}
              </Badge>
              <p className={styles.heroValue}>{props.workspaceLens === "deal-room" ? "Growth, woven together." : props.workspaceLens === "revenue-command" ? "A world of opportunity." : props.workspaceLens === "commercial-desk" ? "Confidence in every deal." : "Make your next move."}</p>
              <p className={styles.heroSubtitle}>
                {workspaceDescriptions[props.workspaceLens]}
              </p>
              <div className={styles.heroMeta}>
                <AvatarStack
                  names={[
                    "Megan Bowen",
                    "Nestor Wilke",
                    "Pradeep Gupta",
                    "Miriam Graham",
                  ]}
                />
                <span className={styles.teamLabel}>4-person pursuit team</span>
                <Badge appearance="tint">{money(scope.opportunity?.value || 0)} Contoso reference</Badge>
                <Badge appearance="tint" color="warning">
                  1 critical dependency
                </Badge>
                <Badge appearance="tint" color="success">
                  72% seller probability
                </Badge>
              </div>
            </div>
            <div className={styles.scoreBlock}>
              <img className={styles.heroPhoto} src={ZAVAMESH.meshTextile} alt="ZavaMesh interwoven performance textile in green and lime" />
              <span className={styles.teamLabel}>{props.workspaceLens === "deal-room" ? "CREDIBLE CLOSE RANGE" : props.workspaceLens === "revenue-command" ? "CONNECTED WORKSPACES" : props.workspaceLens === "commercial-desk" ? "INDEPENDENT AUTHORITY" : "GUIDED SUBMISSION"}</span>
              <span className={styles.score}>{props.workspaceLens === "deal-room" ? "21-28d" : props.workspaceLens === "revenue-command" ? "4 lenses" : props.workspaceLens === "commercial-desk" ? "3 gates" : "3 steps"}</span>
              <span className={styles.teamLabel}>
                {props.workspaceLens === "deal-room" ? "Security evidence sets the path" : "Evidence. Economics. Human decisions."}
              </span>
            </div>
          </section>
        )}
        {props.fullScreen && showReferenceWorkspace && (
          <section aria-label="Role workspace">
            <WorkspaceDashboard
              definition={{ ...props.definition, lens: props.workspaceLens }}
              selectedEvidence={selectedEvidence}
              onSelectEvidence={setSelectedEvidence}
              selectedRegion={referenceRegion}
              onSelectRegion={setReferenceRegion}
              onWorkspaceStateChange={onWorkspaceStateChange}
              dealSession={dealSession}
              dashboardState={workspaceStates["revenue-command"]}
            />
            <h2 className={styles.specialistHeading}>Your Copilot task / {props.definition.title}</h2>
            <p className={styles.subtitle}>The focused task below retains its own evidence, draft and confirmation. Reference visuals and regional budgets are illustrative.</p>
          </section>
        )}
        <RevenueExperiences
          key={`${props.definition.key}|${JSON.stringify(Object.keys(props.properties).sort().map(key => [key, props.properties[key as keyof IRevenueProperties]]))}`}
          {...props}
          committeeVisual={props.fullScreen ? undefined : <BuyingCommittee />}
          visibleWorkspaceLens={props.fullScreen && showReferenceWorkspace ? props.workspaceLens : undefined}
          referenceEvidenceId={props.fullScreen && showReferenceWorkspace ? selectedEvidence : undefined}
          referenceRegion={props.fullScreen && showReferenceWorkspace ? referenceRegion : undefined}
          workspaceState={props.fullScreen && showReferenceWorkspace ? workspaceStates[props.workspaceLens] : undefined}
        />
        {expandError && <p role="alert">The host did not open full screen. Your draft is unchanged.</p>}
        <div className={styles.actions}>
          <Button
            icon={<Chat20Regular />}
            disabled={followUpState === "sending"}
            onClick={sendFollowUp}
          >
            {followUpState === "sending"
              ? "Sending..."
              : "Ask Copilot about this deal"}
          </Button>
          {followUpState === "sent" && (
            <Badge color="success">Sent to Copilot</Badge>
          )}
          {followUpState === "error" && (
            <Badge color="danger">Copilot did not accept the message</Badge>
          )}
        </div>
        <p className={styles.notice}>
          <ShieldCheckmark20Regular />
          Offline showcase · actions and receipts stay in this browser session
        </p>
      </div>
    </>
  );
}

export default function RevenueApp(
  props: IRevenueAppProps,
): React.ReactElement {
  const styles = useStyles();
  const fullScreen = props.displayMode === "fullscreen";
  const [activeLens, setActiveLens] = React.useState<RevenueLens>(
    props.definition.lens,
  );
  const mainRef = React.useRef<HTMLElement>(null);
  if (!props.definition)
    return <Spinner className={styles.spinner} label="Preparing deal room" />;
  const lenses: RevenueLens[] = [
    "my-deals",
    "deal-room",
    "commercial-desk",
    "revenue-command",
  ];
  return (
    <div
      className={mergeClasses(styles.app, fullScreen ? styles.full : styles.inline)}
      data-layout={`${props.definition.key}-${fullScreen ? "fullscreen" : "inline"}`}
    >
      <div className={styles.brandLine} />
      <div className={fullScreen ? styles.shell : undefined}>
        <aside className={styles.rail} hidden={!fullScreen}>
          <div className={styles.brand}>
            <img className={styles.wordmark} src={ZAVAMESH.whiteLogo} alt="ZavaMesh" />
          </div>
          <p className={styles.railCaption}>REVENUE DEAL ROOM</p>
          <nav className={styles.nav} aria-label="Revenue workspaces">
            {lenses.map((lens) => (
              <Button
                key={lens}
                aria-current={activeLens === lens ? "page" : undefined}
                appearance="subtle"
                className={mergeClasses(
                  styles.navButton,
                  activeLens === lens && styles.navActive,
                )}
                icon={
                  lens === "my-deals" ? (
                    <TargetArrow20Regular />
                  ) : lens === "deal-room" ? (
                    <PeopleTeam20Regular />
                  ) : lens === "commercial-desk" ? (
                    <Money20Regular />
                  ) : (
                    <DataTrending20Regular />
                  )
                }
                onClick={() => { setActiveLens(lens); mainRef.current?.querySelector("h1")?.focus(); }}
              >
                {LENS_LABELS[lens]}
              </Button>
            ))}
          </nav>
          <div className={styles.railFooter}><ShieldCheckmark20Regular /><p>Built for momentum.<br />Governed by people.</p><p>Offline showcase<br />21 focused Copilot experiences</p></div>
        </aside>
        <main className={styles.main} ref={mainRef}>
          <RevenueContent
            key={`${props.definition.key}|${JSON.stringify(Object.keys(props.properties).sort().map(key => [key, props.properties[key as keyof IRevenueProperties]]))}`}
            {...props}
            workspaceLens={activeLens}
            fullScreen={fullScreen}
          />
        </main>
      </div>
    </div>
  );
}
