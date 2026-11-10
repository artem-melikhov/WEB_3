<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="lab" tagdir="/WEB-INF/tags" %>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Лабораторная работа 3 - попадание точки</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/static/style.css">
</head>
<body>
  <table id="main-table">
    <tr>
      <td colspan="2">
        <header id="header">
          Мелихов Артём Александрович, P3230, вариант 85150549
        </header>
      </td>
    </tr>
    <tr>
      <td>
        <canvas id="plot" width="400" height="400"></canvas>
      </td>
      <td>
        <form id="point-form" method="post" action="${pageContext.request.contextPath}/check">
          <p class="x-values">
            X:
            <label><input type="checkbox" name="x" value="-2"> -2</label>
            <label><input type="checkbox" name="x" value="-1.5"> -1.5</label>
            <label><input type="checkbox" name="x" value="-1"> -1</label>
            <label><input type="checkbox" name="x" value="-0.5"> -0.5</label>
            <label><input type="checkbox" name="x" value="0"> 0</label>
            <label><input type="checkbox" name="x" value="0.5"> 0.5</label>
            <label><input type="checkbox" name="x" value="1"> 1</label>
            <label><input type="checkbox" name="x" value="1.5"> 1.5</label>
            <label><input type="checkbox" name="x" value="2"> 2</label>
          </p>
          <p>
            <label for="y">Y:</label>
            <input id="y" name="y" type="text" placeholder="Y ∈ (−5; 3)" maxlength="15" inputmode="decimal">
          </p>
          <p>
            <label for="r">R:</label>
            <select id="r" name="r">
              <option value="">Выберите R</option>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
              <option value="2.5">2.5</option>
              <option value="3">3</option>
            </select>
          </p>
          <p>
            <button id="submit-point" type="submit">Проверить</button>
          </p>
          <p id="form-error" role="status"><c:out value="${error}"/></p>
        </form>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <table id="results">
          <thead>
            <tr>
              <th>X</th>
              <th>Y</th>
              <th>R</th>
              <th>Попадание</th>
            </tr>
          </thead>
          <tbody>
            <c:forEach var="row" items="${history}">
              <lab:resultRow row="${row}"/>
            </c:forEach>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
  <script src="${pageContext.request.contextPath}/static/script.js"></script>
</body>
</html>
