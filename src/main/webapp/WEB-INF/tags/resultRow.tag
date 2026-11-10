<%@ tag pageEncoding="UTF-8" %>
<%@ attribute name="row" required="true" type="lab3.CheckResult" %>
<tr data-x="${row.x}" data-y="${row.y}" data-r="${row.r}" data-hit="${row.hit}">
  <td>${row.x}</td>
  <td>${row.y}</td>
  <td>${row.r}</td>
  <td>${row.hit ? 'Попадание' : 'Промах'}</td>
</tr>
