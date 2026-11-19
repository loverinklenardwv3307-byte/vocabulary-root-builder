import type { Part, Root, Word } from './types';

/** 15 prefix forms. im-/in- and tran-/trans- are taught separately. */
export const PREFIXES: Part[] = [
  { id: 'p_ex', role: 'prefix', form: 'ex-', meaning: 'out', note: 'export, extract' },
  {
    id: 'p_im',
    role: 'prefix',
    form: 'im-',
    meaning: 'in; into',
    note: 'The in- form used before p in import. Not the negative im- of impossible.',
  },
  { id: 'p_trans', role: 'prefix', form: 'trans-', meaning: 'across', note: 'transport' },
  {
    id: 'p_tran',
    role: 'prefix',
    form: 'tran-',
    meaning: 'across',
    note: 'Reduced form of trans- before the s in script.',
  },
  {
    id: 'p_in',
    role: 'prefix',
    form: 'in-',
    meaning: 'in; into',
    note: 'inspect and inscription use the inward sense, not the negative prefix.',
  },
  { id: 'p_intro', role: 'prefix', form: 'intro-', meaning: 'inward; within', note: 'introspection' },
  { id: 'p_retro', role: 'prefix', form: 'retro-', meaning: 'backward', note: 'retrospective' },
  { id: 'p_pre', role: 'prefix', form: 'pre-', meaning: 'before', note: 'predict, prediction, predictor' },
  { id: 'p_contra', role: 'prefix', form: 'contra-', meaning: 'against', note: 'contradict, contradiction' },
  { id: 'p_post', role: 'prefix', form: 'post-', meaning: 'after', note: 'postscript' },
  { id: 'p_con', role: 'prefix', form: 'con-', meaning: 'together', note: 'construct, construction' },
  { id: 'p_de', role: 'prefix', form: 'de-', meaning: 'down; apart', note: 'destruction, destructive' },
  {
    id: 'p_at',
    role: 'prefix',
    form: 'at-',
    meaning: 'toward',
    note: 'Form of ad- before t, taught directly as at- in attract.',
  },
  { id: 'p_re', role: 'prefix', form: 're-', meaning: 'back', note: 'retract' },
  { id: 'p_dis', role: 'prefix', form: 'dis-', meaning: 'apart; away', note: 'distract' },
];

/** 6 suffixes. */
export const SUFFIXES: Part[] = [
  { id: 's_able', role: 'suffix', form: '-able', meaning: 'able to be', note: 'portable' },
  { id: 's_er', role: 'suffix', form: '-er', meaning: 'a person who does something', note: 'porter' },
  {
    id: 's_or',
    role: 'suffix',
    form: '-or',
    meaning: 'a person or thing that does something',
    note: 'inspector, predictor',
  },
  { id: 's_ion', role: 'suffix', form: '-ion', meaning: 'an action, process, or result', note: 'inspection' },
  { id: 's_ive', role: 'suffix', form: '-ive', meaning: 'having a quality; relating to', note: 'retrospective' },
  { id: 's_ure', role: 'suffix', form: '-ure', meaning: 'a result or product', note: 'structure' },
];

export const PARTS: Part[] = [...PREFIXES, ...SUFFIXES];

const PART_BY_ID: Record<string, Part> = {};
PARTS.forEach(p => {
  PART_BY_ID[p.id] = p;
});

export function getPart(id: string | null): Part | null {
  if (!id) {
    return null;
  }
  return PART_BY_ID[id] || null;
}

/** 30 curated words, grouped by root in table order. */
export const WORDS: Word[] = [
  // port
  {
    id: 'w_export',
    spelling: 'export',
    rootId: 'port',
    prefixId: 'p_ex',
    suffixId: null,
    definition: 'To send goods to another country.',
    example: 'The farm will export apples to another country.',
  },
  {
    id: 'w_import',
    spelling: 'import',
    rootId: 'port',
    prefixId: 'p_im',
    suffixId: null,
    definition: 'To bring goods into a country.',
    example: 'The shop will import tea from India.',
  },
  {
    id: 'w_portable',
    spelling: 'portable',
    rootId: 'port',
    prefixId: null,
    suffixId: 's_able',
    definition: 'Able to be carried or moved easily.',
    example: 'A portable lamp fits inside her bag.',
  },
  {
    id: 'w_transport',
    spelling: 'transport',
    rootId: 'port',
    prefixId: 'p_trans',
    suffixId: null,
    definition: 'To carry people or goods from one place to another.',
    example: 'Trains transport passengers between cities.',
  },
  {
    id: 'w_porter',
    spelling: 'porter',
    rootId: 'port',
    prefixId: null,
    suffixId: 's_er',
    definition: 'A person whose job includes carrying luggage.',
    example: 'A porter carried the bags to the room.',
  },
  // spect
  {
    id: 'w_inspect',
    spelling: 'inspect',
    rootId: 'spect',
    prefixId: 'p_in',
    suffixId: null,
    definition: 'To look at something carefully to check it.',
    example: 'Engineers inspect the bridge for damage.',
  },
  {
    id: 'w_inspector',
    spelling: 'inspector',
    rootId: 'spect',
    prefixId: 'p_in',
    suffixId: 's_or',
    definition: 'A person whose job is to examine and check things.',
    example: 'The inspector checked the safety of the building.',
  },
  {
    id: 'w_inspection',
    spelling: 'inspection',
    rootId: 'spect',
    prefixId: 'p_in',
    suffixId: 's_ion',
    definition: 'The act of examining something carefully.',
    example: 'The car passed its annual inspection.',
  },
  {
    id: 'w_introspection',
    spelling: 'introspection',
    rootId: 'spect',
    prefixId: 'p_intro',
    suffixId: 's_ion',
    definition: 'The examination of your own thoughts and feelings.',
    example: 'Quiet time gave her a chance for introspection.',
  },
  {
    id: 'w_retrospective',
    spelling: 'retrospective',
    rootId: 'spect',
    prefixId: 'p_retro',
    suffixId: 's_ive',
    definition: 'Looking back at past events or work.',
    example: 'The museum held a retrospective exhibition of her paintings.',
  },
  // dict
  {
    id: 'w_predict',
    spelling: 'predict',
    rootId: 'dict',
    prefixId: 'p_pre',
    suffixId: null,
    definition: 'To say what you think will happen in the future.',
    example: 'Scientists predict rain for tomorrow.',
  },
  {
    id: 'w_prediction',
    spelling: 'prediction',
    rootId: 'dict',
    prefixId: 'p_pre',
    suffixId: 's_ion',
    definition: 'A statement about what may happen in the future.',
    example: 'His prediction about the weather was correct.',
  },
  {
    id: 'w_predictor',
    spelling: 'predictor',
    rootId: 'dict',
    prefixId: 'p_pre',
    suffixId: 's_or',
    definition: 'A sign or factor used to forecast an outcome.',
    example: 'Regular practice is a useful predictor of improvement.',
  },
  {
    id: 'w_contradict',
    spelling: 'contradict',
    rootId: 'dict',
    prefixId: 'p_contra',
    suffixId: null,
    definition: 'To state the opposite of what someone has said.',
    example: 'The new evidence seems to contradict his account.',
  },
  {
    id: 'w_contradiction',
    spelling: 'contradiction',
    rootId: 'dict',
    prefixId: 'p_contra',
    suffixId: 's_ion',
    definition: 'A conflict between statements that cannot both be true.',
    example: 'There is a contradiction between the two reports.',
  },
  // script
  {
    id: 'w_script',
    spelling: 'script',
    rootId: 'script',
    prefixId: null,
    suffixId: null,
    definition: 'The written text for a play, film, or broadcast.',
    example: 'The actor read the script before rehearsal.',
  },
  {
    id: 'w_transcript',
    spelling: 'transcript',
    rootId: 'script',
    prefixId: 'p_tran',
    suffixId: null,
    definition: 'A written record of spoken words.',
    example: 'The reporter checked the interview transcript.',
  },
  {
    id: 'w_transcription',
    spelling: 'transcription',
    rootId: 'script',
    prefixId: 'p_tran',
    suffixId: 's_ion',
    definition: 'The process of turning speech into written text.',
    example: 'The transcription of the interview took an hour.',
  },
  {
    id: 'w_inscription',
    spelling: 'inscription',
    rootId: 'script',
    prefixId: 'p_in',
    suffixId: 's_ion',
    definition: 'Words written or carved on an object.',
    example: 'An inscription on the stone records the date.',
  },
  {
    id: 'w_postscript',
    spelling: 'postscript',
    rootId: 'script',
    prefixId: 'p_post',
    suffixId: null,
    definition: 'An extra note added at the end of a letter.',
    example: 'She added a postscript about the meeting time.',
  },
  // struct
  {
    id: 'w_construct',
    spelling: 'construct',
    rootId: 'struct',
    prefixId: 'p_con',
    suffixId: null,
    definition: 'To build something by putting parts together.',
    example: 'Workers construct the bridge in sections.',
  },
  {
    id: 'w_construction',
    spelling: 'construction',
    rootId: 'struct',
    prefixId: 'p_con',
    suffixId: 's_ion',
    definition: 'The process of building something.',
    example: 'Construction of the new school begins in May.',
  },
  {
    id: 'w_structure',
    spelling: 'structure',
    rootId: 'struct',
    prefixId: null,
    suffixId: 's_ure',
    definition: 'Something made of parts arranged or built together.',
    example: 'The tower is the tallest structure in the town.',
  },
  {
    id: 'w_destruction',
    spelling: 'destruction',
    rootId: 'struct',
    prefixId: 'p_de',
    suffixId: 's_ion',
    definition: 'The act or process of ruining something completely.',
    example: 'The fire caused the destruction of the old shed.',
  },
  {
    id: 'w_destructive',
    spelling: 'destructive',
    rootId: 'struct',
    prefixId: 'p_de',
    suffixId: 's_ive',
    definition: 'Causing serious damage or ruin.',
    example: 'The storm brought destructive winds.',
  },
  // tract
  {
    id: 'w_extract',
    spelling: 'extract',
    rootId: 'tract',
    prefixId: 'p_ex',
    suffixId: null,
    definition: 'To pull or take something out.',
    example: 'The dentist needed to extract the damaged tooth.',
  },
  {
    id: 'w_attract',
    spelling: 'attract',
    rootId: 'tract',
    prefixId: 'p_at',
    suffixId: null,
    definition: 'To draw someone or something toward oneself.',
    example: 'Bright flowers attract bees.',
  },
  {
    id: 'w_traction',
    spelling: 'traction',
    rootId: 'tract',
    prefixId: null,
    suffixId: 's_ion',
    definition: 'The grip that lets a wheel pull against a surface.',
    example: 'Deep tyre grooves improve traction on wet roads.',
  },
  {
    id: 'w_retract',
    spelling: 'retract',
    rootId: 'tract',
    prefixId: 'p_re',
    suffixId: null,
    definition: 'To pull something back or withdraw it.',
    example: 'The turtle can retract its head into its shell.',
  },
  {
    id: 'w_distract',
    spelling: 'distract',
    rootId: 'tract',
    prefixId: 'p_dis',
    suffixId: null,
    definition: 'To draw attention away from something.',
    example: 'Loud music can distract him from his homework.',
  },
];

const WORD_BY_ID: Record<string, Word> = {};
WORDS.forEach(w => {
  WORD_BY_ID[w.id] = w;
});

export function getWord(id: string): Word {
  return WORD_BY_ID[id];
}

/** Roots in curriculum order. */
export const ROOTS: Root[] = [
  {
    id: 'port',
    form: 'port',
    meaning: 'carry',
    wordIds: ['w_export', 'w_import', 'w_portable', 'w_transport', 'w_porter'],
    workedExampleId: 'w_export',
    builderTargetIds: ['w_import', 'w_portable'],
    transferIds: ['w_transport', 'w_porter'],
  },
  {
    id: 'spect',
    form: 'spect',
    meaning: 'look; see',
    wordIds: ['w_inspect', 'w_inspector', 'w_inspection', 'w_introspection', 'w_retrospective'],
    workedExampleId: 'w_inspect',
    builderTargetIds: ['w_inspector', 'w_inspection'],
    transferIds: ['w_introspection', 'w_retrospective'],
  },
  {
    id: 'dict',
    form: 'dict',
    meaning: 'say; speak',
    wordIds: ['w_predict', 'w_prediction', 'w_predictor', 'w_contradict', 'w_contradiction'],
    workedExampleId: 'w_predict',
    builderTargetIds: ['w_prediction', 'w_predictor'],
    transferIds: ['w_contradict', 'w_contradiction'],
  },
  {
    id: 'script',
    form: 'script',
    meaning: 'write',
    wordIds: ['w_script', 'w_transcript', 'w_transcription', 'w_inscription', 'w_postscript'],
    workedExampleId: 'w_script',
    builderTargetIds: ['w_transcript', 'w_transcription'],
    transferIds: ['w_inscription', 'w_postscript'],
  },
  {
    id: 'struct',
    form: 'struct',
    meaning: 'build',
    wordIds: ['w_construct', 'w_construction', 'w_structure', 'w_destruction', 'w_destructive'],
    workedExampleId: 'w_construct',
    builderTargetIds: ['w_construction', 'w_structure'],
    transferIds: ['w_destruction', 'w_destructive'],
  },
  {
    id: 'tract',
    form: 'tract',
    meaning: 'pull; draw',
    wordIds: ['w_extract', 'w_attract', 'w_traction', 'w_retract', 'w_distract'],
    workedExampleId: 'w_extract',
    builderTargetIds: ['w_attract', 'w_traction'],
    transferIds: ['w_retract', 'w_distract'],
  },
];

const ROOT_BY_ID: Record<string, Root> = {};
ROOTS.forEach(r => {
  ROOT_BY_ID[r.id] = r;
});

export function getRoot(id: string): Root {
  return ROOT_BY_ID[id] || ROOTS[0];
}

export function rootIndex(id: string): number {
  const idx = ROOTS.findIndex(r => r.id === id);
  return idx < 0 ? 0 : idx;
}

/** Every prefix and suffix used by a root's five words, in first-use order. */
export function partsForRoot(rootId: string): { prefixes: Part[]; suffixes: Part[] } {
  const root = getRoot(rootId);
  const prefixes: Part[] = [];
  const suffixes: Part[] = [];
  root.wordIds.forEach(id => {
    const word = getWord(id);
    const prefix = getPart(word.prefixId);
    if (prefix && !prefixes.some(p => p.id === prefix.id)) {
      prefixes.push(prefix);
    }
    const suffix = getPart(word.suffixId);
    if (suffix && !suffixes.some(s => s.id === suffix.id)) {
      suffixes.push(suffix);
    }
  });
  return { prefixes, suffixes };
}

export function bareForm(part: Part): string {
  return part.role === 'prefix' ? part.form.replace(/-$/, '') : part.form.replace(/^-/, '');
}

/** "ex + port", "port + able" — a readable split of a curated word. */
export function decompose(wordId: string): string {
  const word = getWord(wordId);
  const prefix = getPart(word.prefixId);
  const suffix = getPart(word.suffixId);
  const root = getRoot(word.rootId);
  const pieces: string[] = [];
  if (prefix) {
    pieces.push(bareForm(prefix));
  }
  pieces.push(root.form);
  if (suffix) {
    pieces.push(bareForm(suffix));
  }
  return pieces.join(' + ');
}
