# Interaktywna strona internetowa do wizualizacji problemu segmentacji sceny dentystycznej - segmentacja panoptyczna
<img src="https://github.com/user-attachments/assets/40faa7df-aa5a-46be-ad5f-5de13bca2bc7" alt="pg_logo_kolor" width="200"/>
<img src="https://github.com/user-attachments/assets/5732fef2-bff0-43cb-8223-8a1c6b198901" alt=eti_logo" width="140"/>
<img src="https://github.com/user-attachments/assets/3247306e-f4dd-4d19-94ca-75cff37c2e10" alt="kibm_logo" width="140"/>

## Autorzy
Projekt realizowany przez studentki Inżynierii Biomedycznej, Informatyki w Medycynie na Politechnice Gdańskiej w ramach przedmiotu: Rozwój aplikacji internetowych w medycynie, na 6 semestrze studiów inżynierskich:
- Katarzyna Gołojuch (193464)  
- Dominika Żmudowska (193153)

Opiekun: dr inż. Anna Jezierska

## Króciutko o projekcie

Webowa aplikacja umożliwiająca wizualizację wyników segmentacji panoptycznej zdjęć stomatologicznych. Projekt realizowany w ramach przedmiotu **Rozwój Aplikacji Internetowych w Medycynie**.

## Opis projektu

Aplikacja webowa umożliwiająca interaktywną wizualizację wyników segmentacji panoptycznej w stomatologii. Użytkownik może:

- nakładać na siebie warstwy: zdjęcie wejściowe, wynik działania modelu oraz maskę segmentacji,
- wybierać, które elementy mają być widoczne, jak zęby czy dziąsła,
- przeglądać klatki wideo z segmentacją,
- obliczać metryki jakości segmentacji (z jednoczesnym zaznaczeniem lokalizacji, dla której została policzona dana wartość),
- sterować widocznością każdej z warstw w obszarze obserwacji.

## Cele i założenia projektu

- Ułatwienie wizualizacji wyników modeli segmentacyjnych w stomatologii  
- Stworzenie intuicyjnego interfejsu do pracy z obrazami i maskami  
- Możliwość analizy dokładności segmentacji z uwzględnieniem lokalizacji  
- Obsługa obrazów statycznych i sekwencji wideo  
- Praca w czasie zbliżonym do rzeczywistego

## Funkcjonalności

- Nakładanie warstw: zdjęcie wejściowe, wynik działania modelu, maska segmentacji  
- Sterowanie widocznością poszczególnych elementów: np. zębów, dziąseł  
- Przeglądanie wideo z segmentacją, przewijanie klatek  
- Obliczanie i prezentacja metryk jakości segmentacji z lokalizacją  
- Interaktywne sterowanie widocznością każdej z warstw

## Technologie

- **Python** (64-bit)  
- **Flask** – backend  
- **React.js** – frontend  
- **PostgreSQL** – baza danych  
- **PyTorch** – model do segmentacji

### Wymagania
- Python 3.x (64-bit)
- Zainstalowane biblioteki wymienione w `requirements.txt` (do dodania)
- Node.js i npm (dla frontendu w React)

## Uruchomienie
Instrukcje dotyczące uruchomienia projektu będą jeszv=cze aktualizowane w późniejszym etapie. Docelowo aplikacja będzie dostępna poprzez link w przeglądarce.

### Backend (Flask)
1. Zainstaluj Pythona 3.x (64-bit)  
2. Zainstaluj wymagane biblioteki:  
   ```bash
   pip install -r requirements.txt
3. Uruchom serwer backendu:
   ```bash
   python visualize_masks.py

### Frontend (React.js)
1. Zainstaluj Node.js i npm
2. Przejdż do folderu frontendu i zainstaluj zależności:
   ```bash
   npm install
3. Uruchom frontend:
   ```bash
   npm start

## Grafiki
### projekt interfejsu
Poniżej znajduje się wstępna grafika przedstawiająca planowany wygląd interfejsu użytkownika:

![SmartSelect_20250412_155407_Samsung Notes](https://github.com/user-attachments/assets/9964d4d5-d745-4f30-aa99-067b51d389db)

## Status projektu

Projekt w trakcie realizacji




