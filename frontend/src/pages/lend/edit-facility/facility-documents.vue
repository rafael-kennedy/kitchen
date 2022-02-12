<template>
  <div v-if="facility.hasAddress">
    <section>
      <h1>License Documents</h1>
      <p>
        Before this facility can be officially listed, we will need each of the
        following documents to be uploaded and on file. If you
      </p>
      <DocumentTypeCard
        v-for="documentType in facility.documentRequirements"
        :documentType="documentType"
        :facility="facility"
      />
    </section>
    <section>
      <h1>Client Documents</h1>
      <p>Select the documents that you will require your clients to submit.</p>
      <section>
        <h3>Recommended Documents</h3>
        <p>
          Select any of the documents that we recommend you ask clients to
          upload. If you ensure that your clients upload these documents, you
          get quick, easy access to licensing documents, making inspections or
          document requests from the health department a breeze.
        </p>

        <recommended-client-document-card
          v-for="documentType in facility.recommendedClientDocuments"
          :documentType="documentType"
          :facility="facility"
        />
      </section>
      <section>
        <h3>Other Documents</h3>
      </section>
    </section>
    <section></section>
  </div>
  <div v-else>
    <h1>
      Please update the address before uploading documents, so that we can
      lookup the requirements from your area.
    </h1>
  </div>
</template>

<script setup>
import DocumentTypeCard from "./document-type-card.vue";
import RecommendedClientDocumentCard from "./recommended-client-document-card.vue";

const props = defineProps({
  facility: { type: Object, required: true },
});
props.facility.fetchDocumentRequirements();
</script>
