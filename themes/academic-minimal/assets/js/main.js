/**
 * Academic Minimal Theme - Main JavaScript
 */

(function() {
  'use strict';

  // Mobile navigation toggle
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);
      menu.classList.toggle('is-open', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('is-open');
      }
    });
  }

  // Expandable sections (summaries and abstracts)
  function initExpandableSummaries() {
    const toggles = document.querySelectorAll('.summary-toggle, .abstract-toggle');

    toggles.forEach(toggle => {
      const contentId = toggle.getAttribute('aria-controls');
      const content = document.getElementById(contentId);

      if (!content) return;

      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        content.setAttribute('aria-hidden', isExpanded);

        // Update +/- icon for abstract toggle
        const icon = toggle.querySelector('.abstract-toggle-icon');
        if (icon) {
          icon.textContent = isExpanded ? '+' : '−';
        }
      });
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      });
    });
  }

  // Citation modal
  function initCitationModal() {
    const overlay = document.getElementById('cite-overlay');
    const modal = document.getElementById('cite-modal');
    const closeBtn = document.getElementById('cite-close');
    const copyBtn = document.getElementById('cite-copy');
    const tabs = document.querySelectorAll('.cite-format-tab');
    const triggers = document.querySelectorAll('[data-cite-trigger]');

    if (!modal || !overlay) return;

    let currentFormat = 'bibtex';

    // Generate citations from paper data
    function generateCitations(data) {
      const authors = data.authors || '';
      const title = data.title || '';
      const journal = data.journal || '';
      const year = data.year || '';
      const volume = data.volume || '';
      const pages = data.pages || '';
      const doi = data.doi || '';
      const url = data.url || '';
      const key = data.bibtexKey || 'article' + year;

      // Parse author names for different formats
      const authorList = authors.split(', ').map(a => a.trim());

      // BibTeX format
      const bibtex = `@article{${key},
  author = {${authors.replace(/, /g, ' and ')}},
  title = {${title}},
  journal = {${journal}},
  year = {${year}},${volume ? `
  volume = {${volume}},` : ''}${pages ? `
  pages = {${pages}},` : ''}${doi ? `
  doi = {${doi}},` : ''}${url ? `
  url = {${url}}` : ''}
}`;

      // APA format (7th edition)
      const apaAuthors = formatAuthorsAPA(authorList);
      const apa = `${apaAuthors} (${year}). ${title}. ${journal}${volume ? `, ${volume}` : ''}${pages ? `, ${pages}` : ''}.${doi ? ` https://doi.org/${doi}` : (url ? ` ${url}` : '')}`;

      // MLA format (9th edition)
      const mlaAuthors = formatAuthorsMLA(authorList);
      const mla = `${mlaAuthors}. "${title}." ${journal}${volume ? `, vol. ${volume}` : ''}${pages ? `, ${pages}` : ''}, ${year}.${doi ? ` https://doi.org/${doi}` : ''}`;

      // Chicago format (author-date)
      const chicagoAuthors = formatAuthorsChicago(authorList);
      const chicago = `${chicagoAuthors}. ${year}. "${title}." ${journal}${volume ? ` ${volume}` : ''}${pages ? `: ${pages}` : ''}.${doi ? ` https://doi.org/${doi}` : ''}`;

      return { bibtex, apa, mla, chicago };
    }

    function formatAuthorsAPA(authors) {
      if (authors.length === 1) {
        return formatSingleAuthorAPA(authors[0]);
      } else if (authors.length === 2) {
        return `${formatSingleAuthorAPA(authors[0])}, & ${formatSingleAuthorAPA(authors[1])}`;
      } else {
        const allButLast = authors.slice(0, -1).map(formatSingleAuthorAPA).join(', ');
        return `${allButLast}, & ${formatSingleAuthorAPA(authors[authors.length - 1])}`;
      }
    }

    function formatSingleAuthorAPA(author) {
      // Handle "A. del Valle" or "First Last" format
      const parts = author.split(' ');
      if (parts.length >= 2) {
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(p => {
          if (p.endsWith('.')) return p;
          return p.charAt(0).toUpperCase() + '.';
        }).join(' ');
        return `${lastName}, ${initials}`;
      }
      return author;
    }

    function formatAuthorsMLA(authors) {
      if (authors.length === 1) {
        return formatSingleAuthorMLA(authors[0]);
      } else if (authors.length === 2) {
        return `${formatSingleAuthorMLA(authors[0])}, and ${authors[1]}`;
      } else {
        return `${formatSingleAuthorMLA(authors[0])}, et al.`;
      }
    }

    function formatSingleAuthorMLA(author) {
      const parts = author.split(' ');
      if (parts.length >= 2) {
        const lastName = parts[parts.length - 1];
        const rest = parts.slice(0, -1).join(' ');
        return `${lastName}, ${rest}`;
      }
      return author;
    }

    function formatAuthorsChicago(authors) {
      if (authors.length === 1) {
        return formatSingleAuthorChicago(authors[0]);
      } else if (authors.length <= 3) {
        const allButLast = authors.slice(0, -1).map((a, i) =>
          i === 0 ? formatSingleAuthorChicago(a) : a
        ).join(', ');
        return `${allButLast}, and ${authors[authors.length - 1]}`;
      } else {
        return `${formatSingleAuthorChicago(authors[0])}, et al.`;
      }
    }

    function formatSingleAuthorChicago(author) {
      const parts = author.split(' ');
      if (parts.length >= 2) {
        const lastName = parts[parts.length - 1];
        const rest = parts.slice(0, -1).join(' ');
        return `${lastName}, ${rest}`;
      }
      return author;
    }

    function openModal(data) {
      const citations = generateCitations(data);

      document.getElementById('cite-bibtex').textContent = citations.bibtex;
      document.getElementById('cite-apa').textContent = citations.apa;
      document.getElementById('cite-mla').textContent = citations.mla;
      document.getElementById('cite-chicago').textContent = citations.chicago;

      overlay.classList.add('is-open');
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      // Focus the close button for accessibility
      closeBtn.focus();
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      modal.classList.remove('is-open');
      document.body.style.overflow = '';

      // Reset copy button
      copyBtn.classList.remove('copied');
      copyBtn.querySelector('span').textContent = 'Copy to clipboard';
    }

    function switchFormat(format) {
      currentFormat = format;

      tabs.forEach(tab => {
        const isActive = tab.dataset.format === format;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive);
      });

      document.querySelectorAll('.cite-text').forEach(text => {
        text.classList.toggle('is-active', text.id === `cite-${format}`);
      });

      // Reset copy button when switching formats
      copyBtn.classList.remove('copied');
      copyBtn.querySelector('span').textContent = 'Copy to clipboard';
    }

    async function copyToClipboard() {
      const activeText = document.querySelector('.cite-text.is-active');
      if (!activeText) return;

      try {
        await navigator.clipboard.writeText(activeText.textContent);
        copyBtn.classList.add('copied');
        copyBtn.querySelector('span').textContent = 'Copied!';

        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('span').textContent = 'Copy to clipboard';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }

    // Event listeners
    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const data = {
          title: trigger.dataset.title,
          authors: trigger.dataset.authors,
          journal: trigger.dataset.journal,
          year: trigger.dataset.year,
          volume: trigger.dataset.volume,
          pages: trigger.dataset.pages,
          doi: trigger.dataset.doi,
          url: trigger.dataset.url,
          bibtexKey: trigger.dataset.bibtexKey
        };
        openModal(data);
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', () => switchFormat(tab.dataset.format));
    });

    copyBtn.addEventListener('click', copyToClipboard);
  }

  // Image lightbox
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = lightbox?.querySelector('.lightbox-close');
    const figures = document.querySelectorAll('.publication-figure');

    if (!lightbox || !figures.length) return;

    figures.forEach(figure => {
      const img = figure.querySelector('img');
      if (!img || img.src.includes('placeholder')) return;

      figure.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }

  // Research interest filtering
  function initResearchFilter() {
    const filterButtons = document.querySelectorAll('.interest-tag[data-filter]');
    const publications = document.querySelectorAll('.publication-wrapper');
    const subtitle = document.getElementById('research-subtitle');

    if (!filterButtons.length || !publications.length) return;

    const subtitles = {
      'all': 'Recent work on environmental risks and climate adaptation',
      'natural-disasters': 'Research on the economic impacts of natural disasters',
      'climate-adaptation': 'Research on climate adaptation policies and mechanisms',
      'health-insurance': 'Research on health, insurance, and social protection'
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');

        // Update subtitle
        if (subtitle && subtitles[filter]) {
          subtitle.textContent = subtitles[filter];
        }

        // Filter publications
        publications.forEach(pub => {
          const topics = pub.dataset.topics || '';

          if (filter === 'all') {
            pub.classList.remove('is-hidden');
          } else if (topics.includes(filter)) {
            pub.classList.remove('is-hidden');
          } else {
            pub.classList.add('is-hidden');
          }
        });
      });
    });
  }

  // Scroll Progress Bar
  function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    function updateProgress() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Back to Top Button
  function initBackToTop() {
    const button = document.getElementById('back-to-top');
    if (!button) return;

    function toggleVisibility() {
      if (window.scrollY > 400) {
        button.classList.add('is-visible');
      } else {
        button.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    toggleVisibility();
  }

  // Dark Mode Toggle
  function initDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;

    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }

      localStorage.setItem('theme', newTheme);
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        if (e.matches) {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    });
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initExpandableSummaries();
    initSmoothScroll();
    initCitationModal();
    initLightbox();
    initResearchFilter();
    initScrollProgress();
    initBackToTop();
    initDarkMode();
  });
})();
