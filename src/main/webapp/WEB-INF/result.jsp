<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="lab" tagdir="/WEB-INF/tags" %>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Лабораторная работа 3 — результат проверки</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/static/style.css">
</head>
<body>
  <main class="result-page">
    <h1>Результат проверки</h1>
    <c:choose>
      <c:when test="${not empty result}">
        <table id="results">
          <thead>
            <tr><th>X</th><th>Y</th><th>R</th><th>Результат</th></tr>
          </thead>
          <tbody id="checked-point">
            <lab:resultRow row="${result}"/>
          </tbody>
        </table>
      </c:when>
      <c:otherwise>
        <p id="result-error"><c:out value="${error}"/></p>
      </c:otherwise>
    </c:choose>
    <p><a href="${pageContext.request.contextPath}/check">Вернуться к форме</a></p>
  </main>
</body>
</html>
