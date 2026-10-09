import type { ToastThemeStyles, ToastType } from "./types";

/**
 * تولید استایل‌های منطبق با تم، مد فعال و رنگ‌های ۳ و ۴ داشبورد برای اعلان‌ها
 * @param type نوع اعلان (موفقیت، خطا، هشدار، اطلاعات)
 * @param isDark وضعیت تم تاریک یا روشن
 * @param accent3 رنگ سوم داشبورد (پیش‌فرض طلایی/آبی)
 * @param accent4 رنگ چهارم داشبورد (پیش‌فرض زمردی/بنفش)
 * @returns شیء حاوی استایل‌های آنلاین و کلاس‌های CSS
 */
export function getToastThemeStyles(
  type: ToastType,
  isDark: boolean,
  accent3: string,
  accent4: string,
): ToastThemeStyles {
  const primaryAccent = accent3 || "#D4AF37";
  const secondaryAccent = accent4 || "#10B981";

  // نگاشت وضعیت‌ها با اولویت‌دهی به رنگ‌های اصلی ۳ و ۴ داشبورد
  const statusColors = {
    success: {
      primary: secondaryAccent,
      secondary: primaryAccent,
      bg: isDark ? "rgba(10, 26, 20, 0.82)" : "rgba(240, 253, 244, 0.92)",
      border: isDark ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.3)",
      glow: "rgba(16, 185, 129, 0.25)",
    },
    error: {
      primary: "#f43f5e",
      secondary: primaryAccent,
      bg: isDark ? "rgba(28, 10, 16, 0.82)" : "rgba(255, 241, 242, 0.92)",
      border: isDark ? "rgba(244, 63, 94, 0.4)" : "rgba(244, 63, 94, 0.3)",
      glow: "rgba(244, 63, 94, 0.25)",
    },
    warning: {
      primary: primaryAccent,
      secondary: secondaryAccent,
      bg: isDark ? "rgba(26, 20, 8, 0.82)" : "rgba(254, 252, 232, 0.92)",
      border: isDark ? "rgba(245, 158, 11, 0.4)" : "rgba(245, 158, 11, 0.3)",
      glow: "rgba(245, 158, 11, 0.25)",
    },
    info: {
      primary: primaryAccent,
      secondary: secondaryAccent,
      bg: isDark ? "rgba(12, 18, 30, 0.82)" : "rgba(239, 246, 255, 0.92)",
      border: isDark ? "rgba(212, 175, 55, 0.35)" : "rgba(212, 175, 55, 0.25)",
      glow: "rgba(212, 175, 55, 0.2)",
    },
  };

  const current = statusColors[type] || statusColors.info;

  const containerStyle: React.CSSProperties = {
    backgroundColor: current.bg,
    borderColor: current.border,
    boxShadow: `0 16px 36px -6px ${current.glow}, 0 4px 12px rgba(0, 0, 0, 0.15)`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  const badgeBgStyle: React.CSSProperties = {
    backgroundColor: `${current.primary}1A`,
    borderColor: `${current.primary}33`,
  };

  const progressStyle: React.CSSProperties = {
    background: `linear-gradient(to right, ${primaryAccent}, ${secondaryAccent})`,
    boxShadow: `0 0 10px ${primaryAccent}88`,
  };

  return {
    containerStyle,
    badgeBgStyle,
    progressStyle,
    iconColor: current.primary,
    badgeTextColor: current.primary,
  };
}
