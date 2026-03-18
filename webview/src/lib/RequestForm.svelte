<script lang="ts">
  import type { Request } from "../type";

  const vscode = acquireVsCodeApi<any, Request>();

  let request = $state<Request>({
    method: "GET",
    headers: {},
    url: ""
  });

</script>
