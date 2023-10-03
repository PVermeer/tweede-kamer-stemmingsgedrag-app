interface FractieI {
  AantalStemmen: number;
  AantalZetels: number;
  Afkorting: string;
  ApiGewijzigdOp: string;
  ContentLength: number;
  ContentType: string;
  DatumActief: string;
  DatumInactief: string;
  GewijzigdOp: string;
  Id: string;
  NaamEN: string;
  NaamNL: string;
  Nummer: number;
  Verwijderd: boolean;
}

export type Fractie = Partial<FractieI>;

interface StemmingI {
  ActorFractie: string;
  ActorNaam: string;
  ApiGewijzigdOp: string;
  Besluit_Id: string;
  FractieGrootte: number;
  Fractie_Id: string;
  GewijzigdOp: string;
  Id: string;
  Persoon_Id: string;
  SidActorFractie: string;
  SidActorLid: string;
  Soort: 'Niet' | 'deelgenomen' | 'Tegen' | 'Voor';
  Vergissing: boolean;
  Verwijderd: boolean;
}

export type Stemming = Partial<StemmingI>;

interface DocumentI {
  Aanhangselnummer: number;
  Alias: string;
  ApiGewijzigdOp: string;
  Citeertitel: string;
  ContentLength: number;
  ContentType: string;
  Datum: string;
  DatumOntvangst: string;
  DatumRegistratie: string;
  DocumentNummer: string;
  GewijzigdOp: string;
  Id: string;
  Kamer: number;
  KenmerkAfzender: string;
  Onderwerp: string;
  Organisatie: string;
  Soort: string;
  Titel: string;
  Vergaderjaar: string;
  Verwijderd: boolean;
  Volgnummer: number;
}

export type Document = Partial<DocumentI>;

interface ZaakI {
  Afgedaan: boolean;
  Alias: string;
  ApiGewijzigdOp: string;
  Citeertitel: string;
  Document: Document[];
  GestartOp: string;
  GewijzigdOp: string;
  Grondslagvoorhang: string;
  GrootProject: boolean;
  HuidigeBehandelstatus: string;
  Id: string;
  Kabinetsappreciatie:
    | 'Geen (expliciete) appreciatie'
    | 'Niet beschikbaar bij gewijzigde moties en/of amendementen'
    | 'Niet beschikbaar bij moties en/of amendementen vóór 1 april 2019'
    | 'Nog niet bekend'
    | 'Nog te ontvangen'
    | 'Ontraden'
    | 'Ontraden, tenzij gewijzigd'
    | 'Oordeel Kamer'
    | 'Overgenomen'
    | 'Verzocht motie aan te houden';
  Nummer: string;
  Onderwerp: string;
  Organisatie: 'Eerste Kamer' | 'Eerste en Tweede Kamer' | 'Tweede kamer';
  Soort:
    | 'Amendement'
    | 'Artikelen/onderdelen (wetsvoorstel)'
    | 'Begroting'
    | 'Brief Europese Commissie'
    | 'Brief Kamer'
    | 'Brief commissie'
    | 'Brief derden'
    | 'Brief regering'
    | 'Brief van lid/fractie/commissie'
    | 'EU-voorstel'
    | 'Initiatiefnota'
    | 'Initiatiefwetgeving'
    | 'Interpellatie'
    | 'Lijst met EU-voorstellen'
    | 'Mondelinge vragen'
    | 'Motie'
    | 'Nationale ombudsman'
    | 'Netwerkverkenning'
    | 'Nota n.a.v. het (nader/tweede nader/enz.) verslag'
    | 'Nota van wijziging'
    | 'Overig'
    | 'PKB/Structuurvisie'
    | 'Parlementair onderzoeksrapport'
    | 'Position paper'
    | 'Rapport/brief Algemene Rekenkamer'
    | 'Rondvraagpunt procedurevergadering'
    | 'Schriftelijke vragen'
    | 'Verdrag'
    | 'Verzoek bij commissie-regeling van werkzaamheden'
    | 'Verzoek bij regeling van werkzaamheden'
    | 'Verzoekschrift'
    | 'Voordrachten en benoemingen'
    | 'Wetenschappelijke factsheet'
    | 'Wetenschapstoets'
    | 'Wetgeving'
    | 'Wijziging RvO'
    | 'Wijzigingen voorgesteld door de regering';
  Status: 'Vrijgegeven';
  Termijn: string;
  Titel: string;
  Vergaderjaar: string;
  Verwijderd: boolean;
  Volgnummer: number;
}

export type Zaak = Partial<ZaakI>;

interface BesluitI {
  AgendapuntZaakBesluitVolgorde: number;
  Agendapunt_Id: string;
  ApiGewijzigdOp: string;
  BesluitSoort: string;
  BesluitTekst: string;
  GewijzigdOp: string;
  Id: string;
  Opmerking: string;
  Status:
    | 'Besluit'
    | 'Concept voorstel'
    | 'Nog te verwerken besluit'
    | 'Voorstel';
  Stemming: Stemming[];
  StemmingsSoort: 'Hoofdelijk' | 'Met handopsteken' | 'Zonder stemming';
  Verwijderd: boolean;
  Zaak: Zaak[];
}

export type Besluit = Partial<BesluitI>;

export interface ODataResponse<T = unknown[]> {
  '@odata.context': string;
  '@odata.nextLink'?: string;
  '@odata.count'?: number;
  value: T;
}

export interface FractieOptions {
  year?: number | null;
  page?: number | null;
}

export interface BesluitOptions {
  year?: number | null;
  page?: number | null;
  fractieId?: Fractie['Id'] | null;
  onderwerp?: string | null;
}

export interface Data<T extends ODataResponse['value']> {
  data: T;
  count: number | null;
  currentPage: number | null;
  nextPage: number | null;
  totalPages: number | null;
}
