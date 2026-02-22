import { LocaleProps } from '../types/isoflowProps';

const locale: LocaleProps = {
  common: {
    exampleText: "This is an example text"
  },
  mainMenu: {
    undo: "Ongedaan maken",
    redo: "Opnieuw",
    open: "Openen",
    exportJson: "Exporteren als JSON",
    import:"Importeren",
    exportCompactJson: "Exporteren als compact JSON",
    exportImage: "Exporteren als afbeelding",
    clearCanvas: "Canvas wissen",
    settings: "Instellingen",
    gitHub: "GitHub"
  },
  helpDialog: {
    title: "Toetsenbord sneltoetsen & Help",
    close: "Sluiten",
    keyboardShortcuts: "Toetsenbord sneltoetsen",
    mouseInteractions: "Muisinteracties",
    action: "Actie",
    shortcut: "Sneltoets",
    method: "Methode",
    description: "Beschrijving",
    note: "Opmerking:",
    noteContent: "Toetsenbord sneltoetsen zijn uitgeschakeld bij het typen in invoervelden, tekstgebieden of inhoudsbewerkbare elementen om conflicten te voorkomen.",
    // Keyboard shortcuts
    undoAction: "Ongedaan maken",
    undoDescription: "Maak de laatste actie ongedaan",
    redoAction: "Opnieuw uitvoeren",
    redoDescription: "Voer de laatste ongedaan gemaakte actie opnieuw uit",
    redoAltAction: "Opnieuw uitvoeren (Alternatief)",
    redoAltDescription: "Alternatieve sneltoets voor opnieuw uitvoeren",
    helpAction: "Help",
    helpDescription: "Open het helpdialoogvenster met toetsenbord sneltoetsen",
    zoomInAction: "Inzoomen",
    zoomInShortcut: "Muiswiel omhoog",
    zoomInDescription: "Zoom in op het canvas",
    zoomOutAction: "Uitzoomen",
    zoomOutShortcut: "Muiswiel omlaag",
    zoomOutDescription: "Zoom uit op het canvas",
    panCanvasAction: "Canvas verplaatsen",
    panCanvasShortcut: "Linker muisknop + Slepen",
    panCanvasDescription: "Verplaats het canvas in de verplaatsmodus",
    contextMenuAction: "Contextmenu",
    contextMenuShortcut: "Rechter muisknop",
    contextMenuDescription: "Open het contextmenu voor items of lege ruimte",
    // Mouse interactions
    selectToolAction: "Selecteer gereedschap",
    selectToolShortcut: "Klik op de selecteerknop",
    selectToolDescription: "Schakel over naar selectiemodus",
    panToolAction: "Pan Gereedschap",
    panToolShortcut: "Klik op de pan-knop",
    panToolDescription: "Schakel over naar panmodus om het canvas te verplaatsen",
    addItemAction: "Item Toevoegen",
    addItemShortcut: "Klik op de knop Item Toevoegen",
    addItemDescription: "Open de pictogramkiezer om nieuwe items toe te voegen",
    drawRectangleAction: "Teken Rechthoek",
    drawRectangleShortcut: "Klik op de rechthoekknop",
    drawRectangleDescription: "Schakel over naar rechthoektekenmodus",
    createConnectorAction: "Maak Connector",
    createConnectorShortcut: "Klik op de connectorknop",
    createConnectorDescription: "Schakel over naar connectormodus",
    addTextAction: "Tekst Toevoegen",
    addTextShortcut: "Klik op de tekstknop",
    addTextDescription: "Maak een nieuw tekstvak"
  },
  connectorHintTooltip: {
    tipCreatingConnectors: "Tip: Connectoren maken",
    tipConnectorTools: "Tip: Connector Gereedschappen",
    clickInstructionStart: "Klik",
    clickInstructionMiddle: "op de eerste knoop of punt, vervolgens",
    clickInstructionEnd: "op de tweede knoop of punt om een verbinding te maken.",
    nowClickTarget: "Klik nu op het doel om de verbinding te voltooien.",
    dragStart: "Sleep",
    dragEnd: "van de eerste knoop naar de tweede knoop om een verbinding te maken.",
    rerouteStart: "Om een connector om te leiden,",
    rerouteMiddle: "linker muisknop",
    rerouteEnd: "op een willekeurig punt langs de connectorlijn en sleep om ankerpunten te maken of te verplaatsen."
  },
  lassoHintTooltip: {
    tipLasso: "Tip: Lasso Selectie",
    tipFreehandLasso: "Tip: Vrije Lasso Selectie",
    lassoDragStart: "Klik en sleep",
    lassoDragEnd: "om een rechthoekige selectiebox te tekenen rond de items die u wilt selecteren.",
    freehandDragStart: "Klik en sleep",
    freehandDragMiddle: "om een",
    freehandDragEnd: "vrije vorm",
    freehandComplete: "rond items te tekenen. Laat los om alle items binnen de vorm te selecteren.",
    moveStart: "Eenmaal geselecteerd,",
    moveMiddle: "klik binnen de selectie",
    moveEnd: "en sleep om alle geselecteerde items samen te verplaatsen."
  },
  importHintTooltip: {
    title: "Diagrammen importeren",
    instructionStart: "Om diagrammen te importeren, klik op de",
    menuButton: "menuknop",
    instructionMiddle: "(☰) in de linkerbovenhoek, en selecteer vervolgens",
    openButton: "\"Open\"",
    instructionEnd: "om uw diagrambestanden te laden."
  },
  connectorRerouteTooltip: {
    title: "Tip: Connectoren omleiden",
    instructionStart: "Zodra uw connectoren zijn geplaatst, kunt u ze naar wens omleiden.",
    instructionSelect: "Selecteer de connector",
    instructionMiddle: "eerst, vervolgens",
    instructionClick: "klik op het connectorpad",
    instructionAnd: "en",
    instructionDrag: "sleep",
    instructionEnd: "om het te wijzigen!"
  },
  connectorEmptySpaceTooltip: {
    message: "Om deze connector met een knoop te verbinden,",
    instruction: "linker muisknop op het uiteinde van de connector en sleep het naar de gewenste knoop."
  },
  settings: {
    zoom: {
      description: "Configureer het zoomgedrag bij gebruik van het muiswiel.",
      zoomToCursor: "Zoom naar cursor",
      zoomToCursorDesc: "Wanneer ingeschakeld, wordt in-/uitgezoomd met het muiscursorpositie als middelpunt. Wanneer uitgeschakeld, wordt in-/uitgezoomd met het canvas als middelpunt."
    },
    hotkeys: {
      title: "Hotkey-instellingen",
      profile: "Hotkey-profiel",
      profileQwerty: "QWERTY (Q, W, E, R, T, Y)",
      profileSmnrct: "SMNRCT (S, M, N, R, C, T)",
      profileNone: "Geen hotkeys",
      tool: "Gereedschap",
      hotkey: "Hotkey",
      toolSelect: "Selecteer",
      toolPan: "Pan",
      toolAddItem: "Add Item",
      toolRectangle: "Rectangle",
      toolConnector: "Connector",
      toolText: "Text",
      note: "Note: Hotkeys work when not typing in text fields"
    },
    pan: {
      title: "Pan Settings",
      mousePanOptions: "Mouse Pan Options",
      emptyAreaClickPan: "Click and drag on empty area",
      middleClickPan: "Middle click and drag",
      rightClickPan: "Right click and drag",
      ctrlClickPan: "Ctrl + click and drag",
      altClickPan: "Alt + click and drag",
      keyboardPanOptions: "Keyboard Pan Options",
      arrowKeys: "Arrow keys",
      wasdKeys: "WASD keys",
      ijklKeys: "IJKL keys",
      keyboardPanSpeed: "Keyboard Pan Speed",
      note: "Note: Pan options work in addition to the dedicated Pan tool"
    },
    connector: {
      title: "Connector Settings",
      connectionMode: "Connection Creation Mode",
      clickMode: "Click Mode (Recommended)",
      clickModeDesc: "Click the first node, then click the second node to create a connection",
      dragMode: "Drag Mode",
      dragModeDesc: "Click and drag from the first node to the second node",
      note: "Note: You can change this setting at any time. The selected mode will be used when the Connector tool is active."
    },
    iconPacks: {
      title: "Icon Pack Management",
      lazyLoading: "Enable Lazy Loading",
      lazyLoadingDesc: "Load icon packs on demand for faster startup",
      availablePacks: "Available Icon Packs",
      coreIsoflow: "Core Isoflow (Always Loaded)",
      alwaysEnabled: "Always enabled",
      awsPack: "AWS Icons",
      gcpPack: "Google Cloud Icons",
      azurePack: "Azure Icons",
      kubernetesPack: "Kubernetes Icons",
      loading: "Loading...",
      loaded: "Loaded",
      notLoaded: "Not loaded",
      iconCount: "{count} icons",
      lazyLoadingDisabledNote: "Lazy loading is disabled. All icon packs are loaded at startup.",
      note: "Icon packs can be enabled or disabled based on your needs. Disabled packs will reduce memory usage and improve performance."
    }
  },
  lazyLoadingWelcome: {
    title: "New Feature: Lazy Loading!",
    message: "Hey! After popular demand, we have implemented Lazy Loading of icons, so now if you want to enable non-standard icon packs you can enable them in the 'Configuration' section.",
    configPath: "Click on the Hamburger icon",
    configPath2: "in the top left to access Configuration.",
    canDisable: "You can disable this behaviour if you wish.",
    signature: "-Stan"
  }
};

export default locale;
