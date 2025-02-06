export const translations = {
    en: {
        allCountries: "All Countries",
        numberOfWords: "Number of words",
        saveAsPNG: "Save as PNG",
        word: "Word",
        frequency: "Frequency",
        countries: "Countries",
        selectCountry: "Select a country"
    },
    fr: {
        allCountries: "Tous les pays",
        numberOfWords: "Nombre de mots",
        saveAsPNG: "Enregistrer en PNG",
        word: "Mot",
        frequency: "Fréquence",
        countries: "Pays",
        selectCountry: "Sélectionner un pays"
    }
};

export function getTranslations() {
    const userLang = navigator.language || navigator.userLanguage;
    const isFrench = userLang.startsWith('fr');
    return isFrench ? translations.fr : translations.en;
} 