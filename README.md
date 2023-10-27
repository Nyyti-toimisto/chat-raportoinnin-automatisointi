
# Chat Raportoinnin automatisointi

Projektin tarkoituksena on automatisoida ja tuottaa tilastodataa Nyyti Ry:n ylläpitämästä chatista. 
Chatissa käyttäjät vastaavat ennen ja jälkeen palautelomakkeisiin, joiden avulla Nyyti kehittää chatin toimintaa.



## Ominaisuudet

- Täysin paikallinen ratkaisu
- Uusia lokeja voidaan luoda helposti ja ohjatusti, jolloin myös kyseisen päivän palautteet haetaan chatista
- Palautteita voidaan rajata päivämäärien perusteella
- Alkukyselyn vastaukset ryhmittyvät kuvaajiin
- Fiilis alkukyselyn tuloksia näytetään pitkän aikavälin kuvaajassa
- Pitkän aikavälin kuvaaja laskee palautteiden perusteella sentimentin (positiiviset - negatiiviset = sentimentti)
- Loppupalautteet ryhmittyvät itsestään sen mukaan minkälaisia kysymys-vastauspareja tietokannasta löytyy. Dynaamisesti mukautuva uusiin kysymyksiin ja vastauksiin. 
- Keskustelee suoraan NinChat API:n kanssa käyttäjän omilla tunnuksilla. Tunnuksia ei tallenneta missään vaiheessa. 


## Asennus

Työpöytäsovellus voidaan joko asentaa tai käyttää suoraan sen jakeluversiota. Näillä ei ole merkityksellistä eroa keskenään. Valinta on käyttäjän. 

Jos käytät asentajaa, seuraa asennusikkunan ohjeita jonka jälkeen sovellus on löydettävissä tietokoneelta samaan tapaan kuin mikä tahansa muukin ohjelma. 

Jos käytät jakeluversiota, kopio kansion tiedostot haluamaasi paikkaan (kuten käyttäjän tiedostot-kansioon) ja tee pikakuvake .exe päättyisestä kuvakkeesta työpöydälle. 


Asennustiedoston ja jakeluversion saamiseksi lue kohta "kehittäjille". 
## Käyttö

Ohjelma käynnistyy yhteenveto-näkymään, joka näyttää kaikki jo ladatut palautteet. Tässä näkymässä ei näy sellaisia palautteita, joita ei ole vielä haettu loki-näkymää käyttäen, vaikka chat-päivä olisikin jo takana päin. 

**Alkupalautteet** 

Alkupalautteet ovat ns. staattisia, eikä niiden sisältö muutu uusien palautteiden myötä, lukuja lukuunottamatta.

**Loppupalautteet**

Loppupalautteet ryhmittyvät kysymyskohtaisesti tietokorttiin. Kortin otsikossa on kysymys, joka kysyttiin ja sen alle rivittyy sen kysymyksen kaikki vastaukset ja niiden lukumäärät. Kysymysten -jotka ovat kyllä/ei kysymyksiä- vaustauksissa näkyvät ainoastaan kyllä vastaukset ja ovat ryhmittyneenä samaan korttiin. Tällöin käyttäjän itse tulee arvioida tai tietää kysymys jota kysyttiin.

Avoimet loppupalautteet ryhmittyvät viimeisimmäksi tauluun. Taulussa on kysymys, ja sen avaamalla näkee kaikki vastaukset joita siihen kysymykseen vastattiin. 

Huomioitavaa on, että jos loppupalautteen kysymykseen useampi käyttäjä on vastannut tismalleen saman vastauksen, ryhmittyy se yläpuolelle kortiksi eikä näy ollenkaan tualulla. Ainoastaan uniikit vastaukset näkyvät taululla. 

**Lokien luominen**

Lokien (ja sen myötä palautteiden) haku täytyy käyttäjän käynnistää itse. Tämä tapahtuu ohjatusti loki-sivulla. 

Lokien haku tapahtuu päivä kerrallaan kirjautumalla omilla ninchat-tunnuksilla sisään ja seuraamalla ohjeita. 

Kun loki on luotu, palautteet haettu ja tiedot ovat oikein siirtyvät palautteet osaksi yhteenveto-näkymää.

Juuri luomasi loki tulisi näkyä myös loki-sivun yhteenveto-näkymässä jossa uusin loki tulisi olla päivittynyt vastaamaan juuri luotua. 
## Kehittäjille

`git clone`

Testaus, kehitys ja build --> Lue package.json

