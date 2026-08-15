let hasPlayedEnglishIntroThisAppLoad = false;

export const shouldShowEnglishIntroOnThisAppLoad = () => !hasPlayedEnglishIntroThisAppLoad;

export const markEnglishIntroPlayedThisAppLoad = () => {
  hasPlayedEnglishIntroThisAppLoad = true;
};
