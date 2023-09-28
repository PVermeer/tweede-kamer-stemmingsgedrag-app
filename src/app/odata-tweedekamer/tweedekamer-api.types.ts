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
  Soort: string;
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
  Kabinetsappreciatie: string;
  Nummer: string;
  Onderwerp: string;
  Organisatie: string;
  Soort: string;
  Status: string;
  Termijn: null;
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
  Status: string;
  Stemming: Stemming[];
  StemmingsSoort: string;
  Verwijderd: boolean;
  Zaak: Zaak[];
}

export type Besluit = Partial<BesluitI>;
