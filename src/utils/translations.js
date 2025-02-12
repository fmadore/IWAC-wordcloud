export const translations = {
    en: {
        allCountries: "All Countries",
        numberOfWords: "Number of words",
        saveAsPNG: "Save as PNG",
        word: "Word",
        frequency: "Frequency",
        countries: "Countries",
        selectCountry: "Select a country",
        wordList: "Word List"
    },
    fr: {
        allCountries: "Tous les pays",
        numberOfWords: "Nombre de mots",
        saveAsPNG: "Enregistrer en PNG",
        word: "Mot",
        frequency: "Fréquence",
        countries: "Pays",
        selectCountry: "Sélectionner un pays",
        wordList: "Liste des mots"
    }
};

export function getTranslations() {
    // Get language from URL path
    const path = window.location.pathname;
    const isFrench = path.includes('/fr/');
    return isFrench ? translations.fr : translations.en;
} 