# Dokumentaatio

## Ohjelman asentaminen

### Mac

Sovelluksen käynnistäminen ja uuden tietokanta tiedoston luominen, jos tietokanta tiedosto on jo olemassa voit mennä vaiheeseen [sovelluksen käyttöönotto](#sovelluksen-käyttöönotto)

#### Tietokannan luominen

1. Avaa TextEdit sovellus
   ![textedit-sovellus](documentation/textedit_app.jpeg)
2. Avaa ylhäältä "Format" välilehti ja paina "Make plain text" tai vaihtoehtoisesti voit käyttää näppäin yhdistelmää ⇧ + ⌘ + T
   ![muodon vaihtaminen](documentation/format_plaintext.jpeg)
3. Kun tiedosto on plain text muodossa se voidaan tallentaa oikeaan muotoon valitsemalla file -> save... tai ⌘ + S
   ![tiedoston tallentaminen](documentation/save.jpeg)
4. seuraavaksi annetaan tiedostolle nimi, joka voi olla ihan mikä vain, mutta tärkeintä on että se päättyy .db
   ![tiedoston nimen vaihtaminen](documentation/change_filename.jpeg)
5. valmista tietokanta on nyt luotu

#### Sovelluksen käyttöönotto

1. Käynnistä sovellus painamalla kahdesti kuvakkeesta
   ![sovelluksen kuvake](documentation/app_icon.jpeg)
2. Kun sovellus on käynnistynyt mene asetukset välilehdelle
   ![asetukset välilehti](documentation/settings.jpeg)
3. Paina vaihda nappia, joka avaa finder näkymän
   ![vaihda nappi](documentation/open_button.jpeg)
4. Etsi ja valitse oikea tietokanta, finder ei anna valita muita kuin .db päätteisiä tiedostoja
   ![finder näkymä](documentation/finder_file.jpeg)
5. paina avaa nappia
   ![avaa nappi](documentation/finder_open.jpeg)
6. sovellus saattaa kysyä lupaa kyseisen kansion tiedostoihin, tässä kohtaa voi painaa ok
   ![lupa tiedostoihin](documentation/finder_permission.jpeg)
7. voit varmistaa mikä tietokanta on käytössä asetukset välilehdeltä
   ![tietokannan tarkistaminen](documentation/check_db.jpeg)
8. Sovellus on nyt valmis käytettäväksi

### Windows

Sovelluksen käynnistäminen ja uuden tietokanta tiedoston luominen, jos tietokanta tiedosto on jo olemassa voit mennä vaiheeseen [sovelluksen käyttöönotto](#sovelluksen-käyttöönotto-windows)

#### Tietokannan luominen

1. Paina hiiren oikeen painiketta
   ![hiiren oikeapainike](documentation/win_rightclick.jpeg)
2. Valitse uusi text document
   ![uusi teksti tiedosto](documentation/win_create_file.jpeg)
3. Avaa tiedosto painamalla sitä kaksi kertaa
   ![avaa teksti tiedosto](documentation/win_open_file.jpeg)
4. Tallenna tiedosto File -> save as tai painamalla crtl+shift+s
   ![tallenna nimellä](documentation/win_save_as.jpeg)
5. Anna tietokannalle nimi joka päättyy .db
   ![tiedoston nimen vaihtaminen](documentation/win_change_name.jpeg)
6. Vaihda tiedoston tyyppi tekstityypistä kaikkiin tyyppeihin.
   ![tiedoston tyypin vaihtaminen](documentation/win_change_filetype.jpeg)
7. Tallenna tiedosto
   ![tiedoston tallentaminen](documentation/win_save_file.jpeg)
8. Valmista tietokanta on nyt luotu

#### Sovelluksen käyttöönotto windows

1. Avaa sovellus painamalla kahdesti kuvakkeesta
   ![sovelluksen avaaminen](documentation/win_start.jpeg)
2. Kun sovellus on käynnistynyt mene asetukset välilehdelle
   ![asetukset välilehti](documentation/win_settings.jpeg)
3. Paina vaihda nappia, joka avaa resurssien hallinta ikkunan
   ![vaihda tietokanta nappi](documentation/win_change_button.jpeg)
4. Etsi ja valitse oikea tietokanta, resurssien hallinta ei anna valita muita kuin .db päätteisiä tiedostoja
   ![resurissien hallinta](documentation/win_database_file.jpeg)
5. Paina avaa nappia
   ![avaa nappi](documentation/win_open_database_file.jpeg)
6. Voit varmistaa mikä tietokanta on käytössä asetukset välilehdeltä
   ![tietokannan tarkistaminen](documentation/win_check_database.jpeg)
7. Sovellus on nyt valmis käytettäväksi

## Palautteiden hakeminen Ninchatistä

1. Mene loki-välilehdelle
   ![yhteenveto-sivu](documentation/log_page.jpeg)
2. Paina aloita nappia
   ![Loki-sivu](documentation/start_button.jpeg)
3. Anna käyttäjätunnuksesi ja paina seuraava
   ![kirjautumis sivu](documentation/login_page.jpeg)
4. Tarkista että tiedot vaikuttavat oikealta
   ![tarkistus sivu](documentation/check_information.jpeg)
5. Odota että ruutuun ilmestyy valmis teksti, jonka jälkeen voit sulkea sivun.
   ![valmis viesti](documentation/ready_window.jpeg)

## Palautteiden lajitteleminen

### Aikavälillä

1. aloitus päivä valitaan painamalla "Start date" nappia, joka avaa kalenteri näkymän
   ![start date nappi](documentation/start_date.jpeg)
2. kalenteri näkymästä valitaan aloitus päivä
   ![kalenteri näkymä](documentation/calendar.jpeg)
    - siniset ympyrät näyttävät päivät, jolloin on tehty palautteita
    - kalenterissä pystyy liikkumaan nuolien avulla tai painamalla kuukaudesta tai vuodesta
3. aloitus päivän jälkeen valitaan aikavälin viimeinen päivä
   ![lopetus päivä](documentation/end_date.jpeg)
4. kun aikaväli on asetettu painetaan etsi nappia
   ![etsi nappi](documentation/find_button.jpeg)
5. sen jälkeen näkyvissä on vain aikaväliin kuuluvat palautteet
   ![aikaväli](documentation/date_range.jpeg)

## Palautteiden tulkitseminen

### Alkupalautteet

1. Alkupalautteista nähdään fiilikset, ikä haarukka, sekä sukupuoli jakauma
   ![alkupalautteet](documentation/pre_feedback.jpeg)
2. Sen alapuolella on viivakaaviossa fiilikset viikoittain
   ![viivakaavio](documentation/line_chart.jpeg)

### Loppupalautteet

1. monivalinta loppupalauteet
   ![monivalinta loppupalaute](documentation/post_feedback.jpeg)
2. monivalintojen jälkeen tulee näkyviin avoin loppupalaute
   ![avoin loppupalaute](documentation/open_feedback.jpeg)
3. avoimet loppupalautteet löytyvät kysymysten alta, ja ne voi avata painamalla plus (+) nappia
   ![plus nappi](documentation/open_feedback_button.jpeg)
4. kysymyksen saa kiinni painamalla miinus (-) nappia
   ![miinus nappi](documentation/open_feedback_close.jpeg)
