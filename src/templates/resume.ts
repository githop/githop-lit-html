import { html } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import { until } from 'lit-html/directives/until';
import {
  ResumeData,
  Accomplishment,
  Card,
  ResumeCards,
  CardTypes,
  emojiMap,
  titleMap,
  FB_URL,
} from '../interfaces';

export function Resume() {
  return html`<div class="gth-resume --x-margin">
    <h1>Tom Hopkins</h1>
    ${until(
      fetchResumeData().then(formatResumeData).then(CardList),
      html`<h1>loading</h1>`
    )}
  </div>`;
}

function CardList(cards: ResumeCards[]) {
  return cards.map(
    (card) => html`<div class="gth-resume-section">
      <div class="--y-padding gth-resume-section__header">
        <span class="--gth-emoji --x-margin">${emojiMap[card.type]}</span>
        <span>
          <h2 class="--gth-underline">${titleMap[card.type]}</h2>
        </span>
      </div>
      <div class="--gth-border">${card.content.map(CardTemplate)}</div>
    </div>`
  );
}

function CardTemplate(card: Card) {
  return html`
    <div class="gth-card --x-margin --y-padding">
      <div class="gth-card__header">
        <div class="--flex-2">
          <h2 class="--gth-underline">
            ${card.link != null && card.link.length > 0
              ? html`<a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="${card.link}"
                  >${card.title}</a
                >`
              : card.title}
          </h2>
        </div>
        <div class="--x-margin"><p class="--gth-badge">${card.date}</p></div>
      </div>
      ${card.position != null && card.position.length > 0
        ? html` <div class="gth-card__position">
            <h3>${card.position}</h3>
          </div>`
        : ''}
      <div class="gth-card__content">
        ${unsafeHTML(card.description)}
        ${card.accomplishments.length > 0
          ? AccomplishmentList(card.accomplishments)
          : ''}
      </div>
    </div>
  `;
}

function AccomplishmentList(accmp: Accomplishment[]) {
  return html`<ul>
    ${accmp.map((acmp) => html`<li>${acmp.text}</li>`)}
  </ul>`;
}

/* data */
function fetchResumeData(): Promise<ResumeData> {
  return fetch(FB_URL)
    .then((response) => response.json())
    .then((data) => data)
    .catch((e) => console.log('error?', e));
}

function formatResumeData(resume: ResumeData): ResumeCards[] {
  const { accomplishments, contents } = resume;

  const accmMap = Object.values(accomplishments).reduce<
    Record<string, Accomplishment[]>
  >((map, accomplishment) => {
    const { parentKey } = accomplishment;
    if (map[parentKey] != null) {
      map[parentKey].push(accomplishment);
    } else {
      map[parentKey] = [accomplishment];
    }
    return map;
  }, {});

  const groupedCards = Object.entries(contents).reduce<
    Record<CardTypes, Card[]>
  >((map, entry) => {
    const [key, content] = entry;
    const withAccomp = Object.assign({}, content, {
      key,
      accomplishments: accmMap[key] ?? [],
    });

    if (map[content.type] != null) {
      map[content.type].push(withAccomp);
    } else {
      map[content.type] = [withAccomp];
    }

    return map;
  }, {} as Record<CardTypes, Card[]>);

  const sortOrderMap: Record<CardTypes, number> = {
    experience: 0,
    sideProjects: 1,
    talks: 2,
    startup: 3,
    education: 4,
    other: 5,
  };
  return Object.entries(groupedCards)
    .map(([key, gc]) => {
      return {
        type: key as CardTypes,
        content: gc.sort(
          (a, b) => +new Date(b.sortDate) - +new Date(a.sortDate)
        ),
      };
    })
    .sort((a, b) => sortOrderMap[a.type] - sortOrderMap[b.type]);
}
