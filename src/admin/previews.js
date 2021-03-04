const {
  w3DateFilter,
  markdownFilter,
  dateFilter,
  helpers,
} = previewUtil;

const env = nunjucks.configure();

env.addFilter('w3DateFilter', w3DateFilter);
env.addFilter('markdownFilter', markdownFilter);
env.addFilter('dateFilter', dateFilter);

const Preview = ({ entry, path, context }) => {
  const data = context(entry.get('data').toJS());
  const html = env.render(path, { ...data, helpers });
  return <div dangerouslySetInnerHTML={{ __html: html }}/>
};

const Home = ({ entry }) => (
  <Preview
    entry={entry}
    path="layouts/home.njk"
    context={({ title, body, postsHeading, archiveButtonText }) => ({
      title,
      content: markdownFilter(body),
      postsHeading,
      archiveButtonText,
      collections: {
        postFeed: [{
          url: 'javascript:void(0)',
          date: new Date(),
          data: {
            title: 'Sample Post',
          },
        }],
      },
    })}
  />
);

const Post = ({ entry }) => (
  <Preview
    entry={entry}
    path="layouts/post.njk"
    context={({ title, date, body }) => ({
      title,
      date,
      content: markdownFilter(body || ''),
    })}
  />
);

const Page = ({ entry }) => (
  <Preview
    entry={entry}
    path="layouts/page.njk"
    context={({ title, body }) => ({
      title,
      content: markdownFilter(body || ''),
    })}
  />
);

const SiteData = ({ entry }) => (
  <Preview
    entry={entry}
    path="layouts/base.njk"
    context={({ name, shortDesc, showThemeCredit }) => ({
      site: {
        name,
        shortDesc,
        showThemeCredit,
      },
    })}
  />
);

const Nav = ({ entry }) => (
  <Preview
    entry={entry}
    path="layouts/base.njk"
    context={({ items }) => ({
      navigation: {
        items,
      },
    })}
  />
);

function shadeHexColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

const Theme = ({ entry }) => {
  // console.log('TK typeof entry', typeof entry)
  // console.log('TK entry', entry)
  // console.log('TK theme preview entry data toJS', entry.get('data').toJS())
  return (
  <Preview
    entry={entry}
    path="layouts/post.njk"
    context={({ colors, fonts, sizeScale }) => {
      let darkColorThemePrimary = shadeHexColor(colors.primary, 0.5)
      let darkColorThemePrimaryGlare = shadeHexColor(colors['primary-glare'], 0.5)
      let cssOverrides = `<style type="text/css">
        :root {
          --color-mode: 'light';
          --color-bg: ${colors.light} !important;
          --color-bg-glare: ${colors.light} !important;
          --color-text: ${colors.dark} !important;
          --color-text-glare: ${colors.dark} !important;
          --color-selection-text: ${colors.light} !important;
          --color-selection-bg: ${colors.dark} !important;
          --color-stroke: ${colors.mid} !important;
          --color-action-bg: ${colors.primary} !important;
          --color-action-text: ${colors.light} !important;
          --color-theme-primary: ${colors.primary} !important;
          --color-theme-primary-glare: ${colors.primaryGlare} !important;
          --color-theme-highlight: ${colors.highlight} !important;
          --color-theme-highlight-block: ${colors.highlight} !important;
        }

        @media(prefers-color-scheme: dark){
          :root {
            --color-bg: ${colors.dark} !important;
            --color-bg-glare: ${colors.slate} !important;
            --color-text: ${colors.light} !important;
            --color-selection-text: ${colors.dark} !important;
            --color-selection-bg: ${colors.light} !important;
            --color-stroke:  ${colors.slate} !important;
            --color-theme-primary: ${darkColorThemePrimary} !important;
            --color-theme-primary-glare: ${darkColorThemePrimaryGlare} !important;
            --color-action-bg:  ${colors.primaryGlare} !important;
            --color-action-text: ${colors.dark} !important;
            --color-theme-highlight: ${colors.highlight} !important;
            --color-theme-highlight-block: ${colors.slate} !important;
            --color-theme-feature-text: ${colors.highlight} !important;
            }
        }
      </style>`
      // console.log('TK cssOverrides', cssOverrides)
      let body = cssOverrides + `TK i'm the body, gotta love me.`
        return ({
          title: 'Theme Preview Title',
          date: new Date(),
          content: markdownFilter(body || ''),
        })
      }
    }
  />
)};

CMS.registerPreviewTemplate('home', Home);
CMS.registerPreviewTemplate('posts', Post);
CMS.registerPreviewTemplate('generic_pages', Page);
CMS.registerPreviewTemplate('site_data', SiteData);
CMS.registerPreviewTemplate('nav', Nav);
CMS.registerPreviewTemplate('theme', Theme);