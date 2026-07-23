import React from "react";

export default function Privacy() {
  return (
    <div className="container-xl py-16">
      <h1 className="h1">Privatlivspolitik</h1>
      <div className="mt-8 grid gap-6 max-w-3xl text-[15px] leading-7 text-[var(--ink-2)]">
        <section>
          <h2 className="h3 text-white">1. Dataansvarlig</h2>
          <p>
            Denne privatlivspolitik beskriver, hvordan Value Profit Trading, som
            driver brandet The Value Profits System og Value Profits Protocol,
            behandler personoplysninger.
          </p>
          <p className="mt-3">
            Har du spørgsmål vedrørende behandlingen af dine personoplysninger,
            kan du kontakte os på:
          </p>
          <p className="mt-3">
            <span className="text-white">Value Profit Trading</span>
            <br />
            E-mail:{" "}
            <a
              href="mailto:Asger@valueprofitssystem.dk"
              className="link-accent"
            >
              Asger@valueprofitssystem.dk
            </a>
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">
            2. Hvilke personoplysninger indsamler vi?
          </h2>
          <p>Vi kan behandle følgende personoplysninger:</p>
          <ul className="list-disc pl-5 mt-3">
            <li>Navn</li>
            <li>E-mailadresse</li>
            <li>Telefonnummer</li>
            <li>Adresse (hvis relevant)</li>
            <li>
              Betalingsoplysninger (betalingskort behandles af vores
              betalingsudbydere – vi opbevarer ikke dine kortoplysninger)
            </li>
            <li>IP-adresse</li>
            <li>Browser- og enhedsoplysninger</li>
            <li>Loginoplysninger</li>
            <li>
              Oplysninger om din brug af vores hjemmeside, app og platforme
            </li>
            <li>Kommunikation med vores support</li>
            <li>Eventuelle øvrige oplysninger, som du selv vælger at give os</li>
          </ul>
          <p className="mt-3">
            Vi indsamler kun oplysninger, der er relevante og nødvendige for de
            formål, der er beskrevet nedenfor.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">3. Hvordan indsamler vi oplysninger?</h2>
          <p>Vi indsamler oplysninger, når du blandt andet:</p>
          <ul className="list-disc pl-5 mt-3">
            <li>besøger vores hjemmeside</li>
            <li>accepterer cookies</li>
            <li>booker et møde</li>
            <li>opretter en konto</li>
            <li>køber et produkt eller medlemskab</li>
            <li>tilmelder dig nyhedsbrev</li>
            <li>kontakter os via e-mail, chat eller kontaktformular</li>
            <li>deltager i vores community</li>
            <li>anvender vores app eller øvrige platforme</li>
          </ul>
        </section>

        <section>
          <h2 className="h3 text-white">4. Formål med behandlingen</h2>
          <p>Vi behandler dine personoplysninger for at:</p>
          <ul className="list-disc pl-5 mt-3">
            <li>levere de produkter og medlemskaber, du har købt</li>
            <li>administrere dit medlemskab og din konto</li>
            <li>levere support</li>
            <li>kommunikere med dig</li>
            <li>forbedre vores produkter, tjenester og brugeroplevelse</li>
            <li>analysere brugen af vores hjemmeside og app</li>
            <li>overholde gældende lovgivning</li>
            <li>forebygge misbrug og sikre vores platforme</li>
            <li>
              sende markedsføring, når du har givet samtykke eller hvor
              lovgivningen tillader det
            </li>
          </ul>
        </section>

        <section>
          <h2 className="h3 text-white">5. Retsgrundlag</h2>
          <p>Vi behandler personoplysninger på baggrund af:</p>
          <ul className="list-disc pl-5 mt-3">
            <li>opfyldelse af en aftale med dig (GDPR artikel 6, stk. 1, litra b)</li>
            <li>retlige forpligtelser (GDPR artikel 6, stk. 1, litra c)</li>
            <li>
              vores legitime interesser, eksempelvis udvikling af vores
              produkter og forebyggelse af misbrug (GDPR artikel 6, stk. 1,
              litra f)
            </li>
            <li>
              dit samtykke, hvor dette er nødvendigt (GDPR artikel 6, stk. 1,
              litra a)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="h3 text-white">6. Videregivelse af oplysninger</h2>
          <p>Vi videregiver kun personoplysninger, når det er nødvendigt.</p>
          <p className="mt-3">
            Vi benytter databehandlere og samarbejdspartnere til blandt andet:
          </p>
          <ul className="list-disc pl-5 mt-3">
            <li>hosting</li>
            <li>cloud-løsninger</li>
            <li>betalingsløsninger</li>
            <li>e-mailsystemer</li>
            <li>analyseværktøjer</li>
            <li>markedsføring</li>
            <li>kundesupport</li>
            <li>kommunikationsplatforme</li>
          </ul>
          <p className="mt-3">
            Alle databehandlere behandler oplysninger efter
            databehandleraftaler og må alene behandle oplysninger efter vores
            instrukser.
          </p>
          <p className="mt-3">
            Hvis personoplysninger overføres til lande uden for EU/EØS, sker
            dette alene på et gyldigt overførselsgrundlag, eksempelvis
            EU-Kommissionens standardkontraktbestemmelser eller et andet lovligt
            overførselsgrundlag.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">7. Opbevaring</h2>
          <p>
            Vi opbevarer kun personoplysninger, så længe det er nødvendigt for
            de formål, hvortil de er indsamlet, eller så længe vi er forpligtet
            hertil efter gældende lovgivning.
          </p>
          <p className="mt-3">
            Når oplysningerne ikke længere er nødvendige, slettes eller
            anonymiseres de.
          </p>
          <p className="mt-3">
            Regnskabs- og bogføringsoplysninger opbevares i den periode, som
            bogføringsloven kræver.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">8. Cookies</h2>
          <p>Vi anvender cookies og lignende teknologier til:</p>
          <ul className="list-disc pl-5 mt-3">
            <li>nødvendige funktioner</li>
            <li>statistik</li>
            <li>analyse</li>
            <li>markedsføring</li>
          </ul>
          <p className="mt-3">
            Du kan til enhver tid ændre eller tilbagekalde dit samtykke via
            vores cookiebanner eller dine browserindstillinger.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">9. Dine rettigheder</h2>
          <p>
            Du har efter databeskyttelseslovgivningen blandt andet ret til:
          </p>
          <ul className="list-disc pl-5 mt-3">
            <li>indsigt i de oplysninger, vi behandler om dig</li>
            <li>berigtigelse af urigtige oplysninger</li>
            <li>sletning af oplysninger</li>
            <li>begrænsning af behandlingen</li>
            <li>dataportabilitet</li>
            <li>at gøre indsigelse mod behandlingen</li>
            <li>at tilbagekalde et samtykke</li>
          </ul>
          <p className="mt-3">
            Tilbagekaldelse af samtykke påvirker ikke lovligheden af den
            behandling, der er foretaget inden tilbagekaldelsen.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">10. Datasikkerhed</h2>
          <p>
            Vi træffer passende tekniske og organisatoriske
            sikkerhedsforanstaltninger for at beskytte dine personoplysninger
            mod uautoriseret adgang, tab, misbrug eller ændring.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">11. Klage</h2>
          <p>
            Hvis du mener, at vi behandler dine personoplysninger i strid med
            gældende lovgivning, er du altid velkommen til at kontakte os.
          </p>
          <p className="mt-3">
            Du har også ret til at indgive en klage til Datatilsynet.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">
            12. Ændringer af privatlivspolitikken
          </h2>
          <p>
            Vi kan løbende opdatere denne privatlivspolitik for at afspejle
            ændringer i lovgivning eller vores behandling af personoplysninger.
          </p>
          <p className="mt-3">
            Den seneste version vil altid være tilgængelig på vores hjemmeside.
          </p>
        </section>

        <section>
          <h2 className="h3 text-white">13. Kontakt</h2>
          <p>
            Har du spørgsmål til denne privatlivspolitik eller vores behandling
            af personoplysninger, kan du kontakte os:
          </p>
          <p className="mt-3">
            <span className="text-white">Value Profit Trading</span>
            <br />
            E-mail:{" "}
            <a
              href="mailto:Asger@valueprofitssystem.dk"
              className="link-accent"
            >
              Asger@valueprofitssystem.dk
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
