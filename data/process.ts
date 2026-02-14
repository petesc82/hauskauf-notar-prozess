import { QuestStep } from '../types';

export const PROCESS_DATA: { steps: QuestStep[] } = {
  steps: [
    {
      id: "g0_santander",
      gate: 0,
      sectionRef: "B1",
      title_es: "Aprobación Hipotecaria Santander",
      title_de: "Santander Hypotheken-Genehmigung",
      description_es: "Verificar la viabilidad de la sustitución de hipoteca o traspaso con Santander.",
      description_de: "Prüfung der Machbarkeit der Hypothekenübernahme oder Ablösung bei Santander.",
      enemy: { name_es: "El Cerbero del Banco", icon: "🏦", severity: "high" },
      evidenceRequired: [
        { code: "carta_saldo", label_es: "Carta Saldo Condicionada", label_de: "Bedingter Saldo-Brief", required: true },
        { code: "buro", label_es: "Consulta Buró", label_de: "Bonitätsprüfung", required: true }
      ],
      positiveOutcome: {
        text_es: "El banco aprueba la operación. Luz verde para avanzar.",
        text_de: "Die Bank genehmigt die Operation. Grünes Licht.",
        xp: 500,
        next: ["g1_rpp_folio"]
      },
      negativeOutcome: {
        text_es: "Santander rechaza el traspaso directo.",
        text_de: "Santander lehnt die direkte Übernahme ab.",
        xp: 50,
        stopFlag: true,
        mitigation: ["g0_plan_b"]
      }
    },
    {
      id: "g0_plan_b",
      gate: 0,
      sectionRef: "I1",
      title_es: "Plan B: Crédito Puente / Liquidez",
      title_de: "Plan B: Überbrückungskredit / Liquidität",
      description_es: "Buscar financiamiento alternativo o liquidar hipoteca actual antes de la venta.",
      description_de: "Alternative Finanzierung suchen oder aktuelle Hypothek vor Verkauf ablösen.",
      enemy: { name_es: "El Cerbero del Banco", icon: "🏦", severity: "high" },
      evidenceRequired: [
        { code: "proof_funds", label_es: "Comprobante de Fondos", label_de: "Kapitalnachweis", required: true }
      ],
      positiveOutcome: {
        text_es: "Fondos asegurados. Se puede proceder como compraventa de contado.",
        text_de: "Mittel gesichert. Barkauf kann fortgesetzt werden.",
        xp: 300,
        next: ["g1_rpp_folio"]
      },
      negativeOutcome: {
        text_es: "Sin financiamiento viable. Riesgo de cancelación.",
        text_de: "Keine finanzierung. Risiko des Abbruchs.",
        xp: 0,
        stopFlag: true
      }
    },
    {
      id: "g1_rpp_folio",
      gate: 1,
      sectionRef: "A1",
      title_es: "Consulta RPP (Folio Real)",
      title_de: "Grundbuchauszug (RPP)",
      description_es: "Obtener y revisar el Folio Real Electrónico en el Registro Público de la Propiedad.",
      description_de: "Elektronischen Grundbuchauszug beim öffentlichen Eigentumsregister prüfen.",
      enemy: { name_es: "El Oráculo del Registro Público", icon: "📜", severity: "high" },
      evidenceRequired: [
        { code: "folio_doc", label_es: "Documento Folio Real", label_de: "Grundbuchdokument", required: true }
      ],
      positiveOutcome: {
        text_es: "Titular coincide, folio activo y digitalizado.",
        text_de: "Eigentümer stimmt überein, Folio aktiv und digitalisiert.",
        xp: 200,
        next: ["g1_gravamen", "g1_civil"]
      },
      negativeOutcome: {
        text_es: "Folio no encontrado o desactualizado (en libros físicos).",
        text_de: "Folio nicht gefunden oder veraltet (nur physische Bücher).",
        xp: 20,
        mitigation: ["g1_rpp_fix"]
      }
    },
    {
      id: "g1_rpp_fix",
      gate: 1,
      sectionRef: "A1-M",
      title_es: "Mitigación: Digitalización RPP",
      title_de: "Mitigation: Digitalisierung RPP",
      description_es: "Solicitar búsqueda en libros y migración a folio electrónico (tarda semanas).",
      description_de: "Suche in Büchern und Migration zu elektronischem Folio beantragen (dauert Wochen).",
      positiveOutcome: {
        text_es: "Folio digitalizado exitosamente.",
        text_de: "Folio erfolgreich digitalisiert.",
        xp: 150,
        next: ["g1_gravamen", "g1_civil"]
      },
      negativeOutcome: {
        text_es: "Error en cadena de titularidad. STOP.",
        text_de: "Fehler in der Eigentümerkette. STOP.",
        xp: 0,
        stopFlag: true
      }
    },
    {
      id: "g1_gravamen",
      gate: 1,
      sectionRef: "A2",
      title_es: "Certificado de Libertad de Gravamen",
      title_de: "Lastenfreiheitsbescheinigung (CLG)",
      description_es: "Verificar que no existan embargos, fianzas o anotaciones preventivas desconocidas.",
      description_de: "Prüfen, ob unbekannte Pfändungen, Bürgschaften oder Vormerkungen existieren.",
      enemy: { name_es: "El Guardián del Gravamen", icon: "⛓️", severity: "high" },
      evidenceRequired: [
        { code: "clg", label_es: "CLG Reciente", label_de: "Aktuelles CLG", required: true }
      ],
      positiveOutcome: {
        text_es: "Solo aparece la hipoteca conocida de Santander.",
        text_de: "Nur die bekannte Santander-Hypothek erscheint.",
        xp: 200,
        next: ["g2_contract"]
      },
      negativeOutcome: {
        text_es: "Aparece un embargo mercantil o anotación extraña.",
        text_de: "Eine handelsrechtliche Pfändung oder seltsame Anmerkung taucht auf.",
        xp: 10,
        stopFlag: true
      }
    },
    {
      id: "g1_civil",
      gate: 1,
      sectionRef: "C1",
      title_es: "Estado Civil y Capacidad",
      title_de: "Familienstand und Geschäftsfähigkeit",
      description_es: "Revisar actas de matrimonio. ¿Sociedad conyugal? ¿Divorcio en proceso?",
      description_de: "Heiratsurkunden prüfen. Gütergemeinschaft? Scheidung im Gange?",
      enemy: { name_es: "La Sombra del Divorcio", icon: "💍", severity: "med" },
      evidenceRequired: [
        { code: "acta_mat", label_es: "Acta de Matrimonio", label_de: "Heiratsurkunde", required: false },
        { code: "id_conyuge", label_es: "INE Cónyuge", label_de: "Ausweis Ehepartner", required: false }
      ],
      positiveOutcome: {
        text_es: "Soltero o Casado con firma asegurada del cónyuge.",
        text_de: "Ledig oder verheiratet mit gesicherter Unterschrift des Partners.",
        xp: 150,
        next: ["g2_contract"]
      },
      negativeOutcome: {
        text_es: "Divorcio contencioso o cónyuge se niega a firmar.",
        text_de: "Streitige Scheidung oder Partner verweigert Unterschrift.",
        xp: 0,
        stopFlag: true
      }
    },
    {
      id: "g2_contract",
      gate: 2,
      sectionRef: "F1",
      title_es: "Estructura de Contrato de Promesa",
      title_de: "Vorvertragsstruktur (Promesa)",
      description_es: "Definir penalizaciones, plazos y cuenta escrow/garantía.",
      description_de: "Strafen, Fristen und Treuhandkonto/Garantie definieren.",
      enemy: { name_es: "El Abogado del Diablo", icon: "⚖️", severity: "med" },
      evidenceRequired: [
        { code: "borrador", label_es: "Borrador Contrato", label_de: "Vertragsentwurf", required: true }
      ],
      positiveOutcome: {
        text_es: "Contrato blindado y aceptado por ambas partes.",
        text_de: "Vertrag abgesichert und von beiden Parteien akzeptiert.",
        xp: 300,
        next: ["g2_sre", "g2_aviso"]
      },
      negativeOutcome: {
        text_es: "Vendedor rechaza cláusulas de penalización.",
        text_de: "Verkäufer lehnt Strafklauseln ab.",
        xp: 50,
        mitigation: ["g2_negotiation"]
      }
    },
    {
      id: "g2_sre",
      gate: 2,
      sectionRef: "I2",
      title_es: "Permiso SRE (Zona Restringida/Extranjero)",
      title_de: "SRE Erlaubnis (Ausländer)",
      description_es: "Si el comprador es extranjero, tramitar permiso ante SRE (o Fideicomiso si aplica).",
      description_de: "Falls Käufer Ausländer ist, SRE-Genehmigung einholen.",
      positiveOutcome: {
        text_es: "Permiso S2 obtenido.",
        text_de: "S2 Erlaubnis erhalten.",
        xp: 200,
        next: ["g3_catastro"]
      },
      negativeOutcome: {
        text_es: "Retraso en SRE.",
        text_de: "Verzögerung bei SRE.",
        xp: 20
      }
    },
    {
      id: "g2_aviso",
      gate: 2,
      sectionRef: "H1",
      title_es: "Aviso Preventivo (Primer Aviso)",
      title_de: "Erste Vormerkung (Aviso Preventivo)",
      description_es: "Notario lanza el aviso al RPP para 'congelar' la propiedad contra nuevos gravámenes.",
      description_de: "Notar sendet Vormerkung an RPP, um Eigentum gegen neue Lasten 'einzufrieren'.",
      evidenceRequired: [
        { code: "boleta_aviso", label_es: "Boleta de Ingreso", label_de: "Eingangsbeleg", required: true }
      ],
      positiveOutcome: {
        text_es: "Propiedad bloqueada a favor del comprador por 30-60 días.",
        text_de: "Eigentum für 30-60 Tage zugunsten des Käufers blockiert.",
        xp: 400,
        next: ["g3_sapal", "g3_predial"]
      },
      negativeOutcome: {
        text_es: "Registro rechaza aviso por discrepancia de nombre.",
        text_de: "Register lehnt Vormerkung wegen Namensabweichung ab.",
        xp: 0,
        stopFlag: true
      }
    },
    {
      id: "g3_catastro",
      gate: 3,
      sectionRef: "G1",
      title_es: "Cotejo Catastro vs Escritura",
      title_de: "Abgleich Kataster vs Urkunde",
      description_es: "Verificar que los m2 de terreno y construcción coincidan.",
      description_de: "Prüfen, ob m2 von Grundstück und Gebäude übereinstimmen.",
      enemy: { name_es: "El Espejo del Catastro", icon: "📐", severity: "med" },
      positiveOutcome: {
        text_es: "Medidas coinciden dentro de tolerancia.",
        text_de: "Maße stimmen innerhalb der Toleranz überein.",
        xp: 200,
        next: ["g3_entrega"]
      },
      negativeOutcome: {
        text_es: "Diferencia sustancial > 10%. Requiere rectificación.",
        text_de: "Wesentliche Abweichung > 10%. Berichtigung erforderlich.",
        xp: 50,
        mitigation: ["g3_rectificacion"]
      }
    },
    {
      id: "g3_sapal",
      gate: 3,
      sectionRef: "D1",
      title_es: "No Adeudo SAPAL (Agua)",
      title_de: "Keine Schulden SAPAL (Wasser)",
      description_es: "Obtener constancia de no adeudo de agua.",
      description_de: "Bescheinigung über Schuldenfreiheit beim Wasseramt.",
      enemy: { name_es: "Los No-Adeudos", icon: "💧", severity: "low" },
      positiveOutcome: {
        text_es: "Cuenta al corriente.",
        text_de: "Konto ausgeglichen.",
        xp: 100
      },
      negativeOutcome: {
        text_es: "Deuda oculta detectada.",
        text_de: "Versteckte Schulden entdeckt.",
        xp: 10
      }
    },
    {
      id: "g3_predial",
      gate: 3,
      sectionRef: "D2",
      title_es: "No Adeudo Predial",
      title_de: "Keine Schulden Grundsteuer",
      description_es: "Verificar pagos de impuesto predial.",
      description_de: "Zahlungen der Grundsteuer prüfen.",
      positiveOutcome: {
        text_es: "Predial pagado todo el año.",
        "text_de": "Grundsteuer für das ganze Jahr bezahlt.",
        "xp": 100
      },
      negativeOutcome: {
        text_es: "Adeudo de años anteriores.",
        "text_de": "Schulden aus Vorjahren.",
        "xp": 10
      }
    },
    {
      id: "g3_entrega",
      gate: 3,
      sectionRef: "G2",
      title_es: "Entrega de Posesión Física",
      title_de: "Physische Übergabe (Besitz)",
      description_es: "Recorrido final, inventario, llaves y medidores.",
      description_de: "Endbegehung, Inventar, Schlüssel und Zähler.",
      positiveOutcome: {
        text_es: "Casa vacía y en condiciones acordadas.",
        "text_de": "Haus leer und im vereinbarten Zustand.",
        "xp": 300,
        next: ["g3_cierre_boss"]
      },
      negativeOutcome: {
        text_es: "Inquilinos no salieron o daños nuevos.",
        "text_de": "Mieter nicht ausgezogen oder neue Schäden.",
        "xp": 0,
        stopFlag: true
      }
    },
    {
      id: "g3_cierre_boss",
      gate: 3,
      sectionRef: "FINAL",
      title_es: "BOSS FINAL: Cierre Notarial",
      title_de: "FINAL BOSS: Notarieller Abschluss",
      description_es: "Firma de escritura, pago de saldo, retención de impuestos.",
      description_de: "Unterschrift der Urkunde, Restzahlung, Steuereinbehalt.",
      enemy: { name_es: "Cierre Notarial", icon: "🏰", severity: "high" },
      dependsOn: ["g3_sapal", "g3_predial", "g2_aviso"],
      positiveOutcome: {
        text_es: "¡Felicidades! Eres dueño de la casa en León.",
        "text_de": "Glückwunsch! Du bist Eigentümer des Hauses in León.",
        "xp": 1000
      },
      negativeOutcome: {
        text_es: "Falta un documento o fondos no llegaron a tiempo.",
        "text_de": "Dokument fehlt oder Gelder nicht rechtzeitig eingetroffen.",
        "xp": 0
      }
    }
  ]
};