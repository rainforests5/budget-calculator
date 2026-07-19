# 💰 Zaawansowany Kalkulator Budżetu Domowego

Nowoczesna aplikacja webowa do zarządzania domowym budżetem z zaawansowanymi funkcjonalościami śledzenia dochodów i wydatków.

## 🎯 Funkcjonalności

### 📊 Dashboard
- Przegląd key metrics (przychody, wydatki, budżet, saldo)
- Interaktywne wykresy wydatków po kategoriach
- Porównanie przychodów i wydatków
- Status budżetów z alertami o przekroczeniach
- Selekcja okresu analizy (1, 2, 3, 6, 12 miesięcy)

### ➕ Dodawanie Transakcji
- Dodawanie dochodów i wydatków
- Kategoryzacja transakcji
- Definiowanie okresowości (jednorazowo, 1-12 miesięcy, cały rok)
- Opis i notatki do każdej transakcji
- Łatwy interfejs formularza

### 📝 Zarządzanie Transakcjami
- Przeglądanie wszystkich transakcji w tabeli
- Filtrowanie po typie, kategorii i zakresie dat
- Edycja istniejących transakcji
- Usuwanie transakcji
- Sortowanie po dacie

### 🏷️ Zarządzanie Kategoriami
- Domyślne kategorie przychodu i wydatków
- Dodawanie nowych kategorii
- Przypisywanie kolorów kategoriom
- Usuwanie kategorii
- Oddzielenie kategorii dla przychodów i wydatków

### 💼 Budżety z Alertami
- Ustawianie limitów budżetu na kategorie
- Okresy: miesięczny, kwartalny, roczny
- Wizualne paski postępu
- Alerty o zbliżaniu się do limitu (80%)
- Ostrzeżenia o przekroczeniu budżetu (100%)
- Wyświetlanie pozostałej kwoty budżetu

### 📈 Raporty i Statystyki
- Generowanie raportów za różne okresy
- Zestawienie przychodów vs wydatków
- Analiza wydatków po kategoriach
- Procentowy udział każdej kategorii

### 📥📤 Eksport/Import
- Eksport danych do CSV
- Eksport raportu jako tekst
- Import danych z pliku CSV
- Pełna edycja danych poprzez CSV

### ⚙️ Ustawienia
- Zarządzanie danymi
- Reset wszystkich danych
- Import/Export

## 🚀 Jak Uruchomić

1. Otwórz plik `index.html` w przeglądarce
2. Aplikacja działa całkowicie offline (dane przechowywane w przeglądarce)
3. Brak konieczności instalacji czy rejestracji

## 💾 Przechowywanie Danych

Aplikacja przechowuje wszystkie dane w `localStorage` przeglądarki:
- **categories** - definicje kategorii
- **transactions** - wszystkie transakcje
- **budgets** - ustawione budżety

## 🎨 Interfejs

- Nowoczesny design z gradientami
- Responsywny layout (mobile-friendly)
- Intuicyjne nawigowanie
- Kolorowe karty statystyk
- Ikony emoji dla łatwości identyfikacji

## 📋 Struktura Danych

### Transakcja
```javascript
{
  id: number,
  type: 'income' | 'expense',
  categoryId: number,
  categoryName: string,
  amount: number,
  date: string (YYYY-MM-DD),
  periodicity: '1' | '1-month' | '2-months' | ... | '12-months',
  description: string,
  notes: string,
  createdAt: ISO string
}
```

### Kategoria
```javascript
{
  id: number,
  name: string,
  type: 'income' | 'expense',
  color: string (hex)
}
```

### Budżet
```javascript
{
  id: number,
  categoryId: number,
  categoryName: string,
  amount: number,
  period: 'monthly' | 'quarterly' | 'yearly',
  createdAt: ISO string
}
```

## 🔧 Technologia

- **HTML5** - struktura aplikacji
- **CSS3** - styling i animacje
- **Vanilla JavaScript** - logika aplikacji
- **LocalStorage API** - przechowywanie danych
- **Canvas API** - wykresy

## 📝 Periodalność Transakcji

Aplikacja wspiera następujące okresy:
- Jednorazowo
- 1 miesiąc
- 2 miesiące
- 3 miesiące (kwartal)
- 4 miesiące
- 5 miesięcy
- 6 miesięcy
- 7 miesięcy
- 8 miesięcy
- 9 miesięcy
- 10 miesięcy
- 11 miesięcy
- 12 miesięcy (cały rok)

## ⚡ Cechy

✅ Całkowicie responsywna  
✅ Bez zależności zewnętrznych  
✅ Szybka i lekka  
✅ Prywatność - dane nigdy nie opuszczają urządzenia  
✅ Darkmode ready (można łatwo dodać)  
✅ Wielojęzyczność (polska)  

## 📜 Licencja

MIT

## 👤 Autor

Stworzono dla efektywnego zarządzania budżetem domowym.

---

**Uwaga:** Wszystkie dane są przechowywane lokalnie w przeglądarce. Jeśli oczyścisz pamięć przeglądarki, dane zostaną usunięte. Regularnie eksportuj swoje dane!
