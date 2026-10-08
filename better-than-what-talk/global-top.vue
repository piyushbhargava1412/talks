<!-- Deck-wide overlay. The ruler is left off the title and thank-you slides,
     which carry the balance scale instead, and off any slide whose frontmatter
     says `ruler: false` (content that runs to the bottom edge). -->
<template>
  <RulerProgress
    v-if="$nav.currentPage > 1 && $nav.currentPage < $nav.total
      && $nav.currentSlideRoute?.meta?.slide?.frontmatter?.ruler !== false"
    :page="$nav.currentPage"
    :total="$nav.total"
  />
</template>
