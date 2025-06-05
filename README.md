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
- przeglądać klatki wideo z segmentacją,
- obliczać metryki jakości segmentacji
- sterować widocznością warstw w obszarze obserwacji.

Niestety ze względu na prawa autorskie, nie mamy możliwości udostępnienia niezbędnych plkiów do działania aplikacji. Aby skutecznie wykorzystywać możliwości oferowane przez aplikację webową, należy zaopatrzyć się we własne dane. 

## Cele i założenia projektu

- Ułatwienie wizualizacji wyników modeli segmentacyjnych w stomatologii  
- Stworzenie intuicyjnego interfejsu do pracy z obrazami i maskami   
- Obsługa obrazów statycznych i sekwencji wideo  
- Praca w czasie zbliżonym do rzeczywistego

## Funkcjonalności

- Nakładanie warstw: zdjęcie wejściowe, wynik działania modelu, maska segmentacji  
- Sterowanie widocznością poszczególnych warstw obszaru obserwacji 
- Przeglądanie wideo z segmentacją, przewijanie klatek  
- Interaktywne sterowanie widocznością każdej z warstw

## Technologie

- **Python** (64-bit)  
- **Flask** – backend  
- **React.js** – frontend   
- **PyTorch** – model do segmentacji

### Wymagania
- Python 3.x (64-bit)
- Zainstalowane biblioteki wymienione w `requirements.txt` 
- Node.js i npm (dla frontendu w React)

## Uruchomienie
Strona jest hostowana pod linikiem: https://projekt-raim.onrender.com/ 

Wystarczy w niego kliknąć i strona się uruchomi. 

### Backend (Flask)
1. Zainstaluj Pythona 3.x (64-bit)  
2. Zainstaluj wymagane biblioteki:  
   ```bash
   pip install -r requirements.txt
3. Uruchom serwer backendu:
   ```bash
   python masks_visualization_ready.py

### Frontend (React.js)
1. Zainstaluj Node.js i npm
2. Przejdż do folderu frontendu i zainstaluj zależności:
   ```bash
   npm install
3. Uruchom frontend:
   ```bash
   npm start

## Działanie aplikacji
W obszarze opisanym jako zdjęcie wejściowe należy dodać pliki w formatach .png lub .jpg przedstawiające klatki z wideo z kamery dentystycznej. 
Obszar opisany jako maska przyjmuje pliki w formatach .png lub .jpg wygenerowene przez plik masks_visualization_ready.py na podstawie maski w formacie .json COCO. 
Przestrzeń na model przyjmuje pliki w formatach .png lub .jpg wygenerowene przez model jako jego predykcje obszarów zgodnie z zadanymi klasami. 

Niestety ze względu na prawa autorskie, nie mamy możliwości udostępnienia plików do wgrania na stronę, niezbędnych do działania aplikacji. 
Aby skutecznie wykorzystywać możliwości oferowane przez aplikację webową, należy zaopatrzyć się we własne dane. 

W panelu znajdującym się po lewej stronie można zaobserwować legendę kolorów oraz mechanizm sterowania widocznością maski i modelu w obszarze obserwacji. 
Z założenia, model jest warstwą wierzchnią, stąd przy ustawieniu 100% widoczności na obu warstwach (masce i modelu), będzie widoczna grafika predykcji modelu.

## Grafiki
### Projekt interfejsu
Poniżej znajduje się wstępna grafika przedstawiająca planowany wygląd interfejsu użytkownika:

![SmartSelect_20250412_155407_Samsung Notes](https://github.com/user-attachments/assets/9964d4d5-d745-4f30-aa99-067b51d389db)

### Wykonanie
Poniżej znajduje się grafika przedstawiająca wygląd interfejsu użytkownika zaraz po uruchomieniu strony:

![image](https://github.com/user-attachments/assets/a0e6cce3-3f46-4797-96ae-ce6a84712c23)


Poniżej znajduje się grafika przedstawiająca wygląd interfejsu użytkownika po dodaniu plików w miejsca przeznaczone:

![image](https://github.com/user-attachments/assets/e933cd91-09a4-45f0-b34a-74c0b7f1c3c3)

## Status projektu

Projekt w trakcie realizacji




