import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Set;
import java.util.regex.Pattern;

public final class AreaCheckServlet extends HttpServlet {
    private static final Set<String> FORM_X = Set.of("-2", "-1.5", "-1", "-0.5", "0", "0.5", "1", "1.5", "2");
    private static final Set<String> RADII = Set.of("1", "1.5", "2", "2.5", "3");
    private static final Pattern DECIMAL = Pattern.compile("[-+]?(?:[0-9]+(?:[.,][0-9]+)?|[.,][0-9]+)");
    private static final BigDecimal FORM_MIN_Y = BigDecimal.valueOf(-5);
    private static final BigDecimal FORM_MAX_Y = BigDecimal.valueOf(3);
    private static final BigDecimal GRAPH_LIMIT = new BigDecimal("6.25");

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            CheckResult result = check(request);
            ControllerServlet.resultsBean(request).add(result);
            request.setAttribute("result", result);
        } catch (IllegalArgumentException error) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            request.setAttribute("error", error.getMessage());
        }

        request.getRequestDispatcher("/WEB-INF/result.jsp").forward(request, response);
    }

    private static CheckResult check(HttpServletRequest request) {
        String xText = singleParameter(request, "x");
        String yText = singleParameter(request, "y");
        String rText = singleParameter(request, "r");
        String[] source = request.getParameterValues("source");
        boolean graph = source != null;

        if (graph && (source.length != 1 || !"graph".equals(source[0]))) {
            throw new IllegalArgumentException("Неизвестный источник координат");
        }
        if (!RADII.contains(rText)) {
            throw new IllegalArgumentException("Выберите R из списка");
        }
        if (!graph && !FORM_X.contains(xText)) {
            throw new IllegalArgumentException("Выберите X из списка");
        }

        BigDecimal x = decimal(xText, "X");
        BigDecimal y = decimal(yText, "Y");
        BigDecimal r = new BigDecimal(rText);

        if (graph) {
            if (x.abs().compareTo(GRAPH_LIMIT) > 0 || y.abs().compareTo(GRAPH_LIMIT) > 0) {
                throw new IllegalArgumentException("Точка находится за пределами графика");
            }
        } else if (y.compareTo(FORM_MIN_Y) <= 0 || y.compareTo(FORM_MAX_Y) >= 0) {
            throw new IllegalArgumentException("Y должен быть между -5 и 3, не включая границы");
        }
        return new CheckResult(x, y, r, AreaChecker.isHit(x, y, r));
    }

    private static String singleParameter(HttpServletRequest request, String name) {
        String[] values = request.getParameterValues(name);
        if (values == null || values.length != 1) {
            throw new IllegalArgumentException("Передайте X, Y и R по одному разу");
        }

        return values[0].strip();
    }

    private static BigDecimal decimal(String value, String label) {

        if (value.length() > 15 || !DECIMAL.matcher(value).matches()) {
            throw new IllegalArgumentException(label + " должен быть десятичным числом длиной до 15 символов");
        }
        return new BigDecimal(value.replace(',', '.'));
    }
}
