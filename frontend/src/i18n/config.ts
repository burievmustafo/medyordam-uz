import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
    uz: {
        translation: {
            // Navigation
            "appName": "Tez Tibbiy Yordam Tizimi",
            "logout": "Chiqish",

            // Dashboard
            "patientSearch": "Bemorni qidirish",
            "enterPassportId": "Pasport ID kiriting",
            "passportIdPlaceholder": "Pasport ID kiriting (masalan, AB123456)",
            "search": "Qidirish",
            "searching": "Qidirilmoqda...",
            "patientNotFound": "Bemor topilmadi",
            "recentSearches": "Oxirgi qidiruvlar",
            "clear": "Tozalash",
            "clearHistory": "Tarixni tozalash",

            // Patient Detail
            "backToSearch": "Qidiruvga qaytish",
            "patientDetails": "Bemor ma'lumotlari",
            "quickSearchPlaceholder": "Tez qidiruv ID bo'yicha...",
            "print": "Chop etish",
            "addDiagnosis": "Tashxis qo'shish",
            "medicalHistory": "Tibbiy tarix",
            "immunizations": "Emlashlar",
            "noDiagnosesRecorded": "Tashxislar yo'q",
            "medicalHistoryWillAppear": "Tibbiy tarix bu yerda ko'rinadi",
            "noImmunizationsRecorded": "Emlashlar yo'q",
            "loading": "Yuklanmoqda...",
            "loadingPatientData": "Bemor ma'lumotlari yuklanmoqda...",

            // Patient Info
            "male": "Erkak",
            "female": "Ayol",
            "other": "Boshqa",
            "id": "ID",

            // Add Diagnosis Modal
            "addNewDiagnosis": "Yangi tashxis qo'shish",
            "diagnosisName": "Tashxis nomi",
            "diagnosisNamePlaceholder": "masalan, Gripp",
            "description": "Tavsif",
            "descriptionPlaceholder": "Klinik eslatmalar...",
            "cancel": "Bekor qilish",
            "saveDiagnosis": "Tashxisni saqlash",
            "saving": "Saqlanmoqda...",
            "repeatedTestWarning": "Takroriy test kerak emas: Bemorning bu tashxisi allaqachon bor.",

            // Login
            "doctorLogin": "Shifokor kirishi",
            "accessEmergencyRecords": "Tez tibbiy yordam yozuvlariga kirish",
            "email": "Email",
            "password": "Parol",
            "login": "Kirish",
            "invalidCredentials": "Noto'g'ri login ma'lumotlari",
            "invalidApiKey": "Noto'g'ri API kalit",

            // Common
            "doctor": "Shifokor",
            "date": "Sana",
            "remove": "O'chirish",
            "removeFromHistory": "Tarixdan o'chirish",
        }
    },
    ru: {
        translation: {
            // Navigation
            "appName": "Система Скорой Медицинской Помощи",
            "logout": "Выход",

            // Dashboard
            "patientSearch": "Поиск пациента",
            "enterPassportId": "Введите ID паспорта",
            "passportIdPlaceholder": "Введите ID паспорта (например, AB123456)",
            "search": "Поиск",
            "searching": "Поиск...",
            "patientNotFound": "Пациент не найден",
            "recentSearches": "Недавние поиски",
            "clear": "Очистить",
            "clearHistory": "Очистить историю",

            // Patient Detail
            "backToSearch": "Назад к поиску",
            "patientDetails": "Данные пациента",
            "quickSearchPlaceholder": "Быстрый поиск по ID...",
            "print": "Печать",
            "addDiagnosis": "Добавить диагноз",
            "medicalHistory": "Медицинская история",
            "immunizations": "Прививки",
            "noDiagnosesRecorded": "Диагнозов нет",
            "medicalHistoryWillAppear": "Медицинская история появится здесь",
            "noImmunizationsRecorded": "Прививок нет",
            "loading": "Загрузка...",
            "loadingPatientData": "Загрузка данных пациента...",

            // Patient Info
            "male": "Мужской",
            "female": "Женский",
            "other": "Другой",
            "id": "ID",

            // Add Diagnosis Modal
            "addNewDiagnosis": "Добавить новый диагноз",
            "diagnosisName": "Название диагноза",
            "diagnosisNamePlaceholder": "например, Грипп",
            "description": "Описание",
            "descriptionPlaceholder": "Клинические заметки...",
            "cancel": "Отмена",
            "saveDiagnosis": "Сохранить диагноз",
            "saving": "Сохранение...",
            "repeatedTestWarning": "Повторный тест не требуется: У пациента уже есть этот диагноз.",

            // Login
            "doctorLogin": "Вход для врача",
            "accessEmergencyRecords": "Доступ к записям скорой помощи",
            "email": "Email",
            "password": "Пароль",
            "login": "Войти",
            "invalidCredentials": "Неверные учетные данные",
            "invalidApiKey": "Неверный API ключ",

            // Common
            "doctor": "Врач",
            "date": "Дата",
            "remove": "Удалить",
            "removeFromHistory": "Удалить из истории",
        }
    },
    en: {
        translation: {
            // Navigation
            "appName": "Emergency Medical System",
            "logout": "Logout",

            // Dashboard
            "patientSearch": "Patient Search",
            "enterPassportId": "Enter Passport ID to access medical history",
            "passportIdPlaceholder": "Enter Passport ID (e.g., AB123456)",
            "search": "Search",
            "searching": "Searching...",
            "patientNotFound": "Patient not found",
            "recentSearches": "Recent Searches",
            "clear": "Clear",
            "clearHistory": "Clear history",

            // Patient Detail
            "backToSearch": "Back to Search",
            "patientDetails": "Patient Details",
            "quickSearchPlaceholder": "Quick search by ID...",
            "print": "Print",
            "addDiagnosis": "Add Diagnosis",
            "medicalHistory": "Medical History",
            "immunizations": "Immunizations",
            "noDiagnosesRecorded": "No diagnoses recorded",
            "medicalHistoryWillAppear": "Medical history will appear here",
            "noImmunizationsRecorded": "No immunizations recorded",
            "loading": "Loading...",
            "loadingPatientData": "Loading patient data...",

            // Patient Info
            "male": "Male",
            "female": "Female",
            "other": "Other",
            "id": "ID",

            // Add Diagnosis Modal
            "addNewDiagnosis": "Add New Diagnosis",
            "diagnosisName": "Diagnosis Name",
            "diagnosisNamePlaceholder": "e.g., Influenza",
            "description": "Description",
            "descriptionPlaceholder": "Clinical notes...",
            "cancel": "Cancel",
            "saveDiagnosis": "Save Diagnosis",
            "saving": "Saving...",
            "repeatedTestWarning": "Repeated test not required: Patient already has this diagnosis.",

            // Login
            "doctorLogin": "Doctor Login",
            "accessEmergencyRecords": "Access emergency patient records",
            "email": "Email",
            "password": "Password",
            "login": "Login",
            "invalidCredentials": "Invalid login credentials",
            "invalidApiKey": "Invalid API key",

            // Common
            "doctor": "Doctor",
            "date": "Date",
            "remove": "Remove",
            "removeFromHistory": "Remove from history",
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'uz',
        lng: localStorage.getItem('language') || 'uz',

        interpolation: {
            escapeValue: false
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
