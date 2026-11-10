package lab3;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

public final class ControllerServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        showForm(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding(StandardCharsets.UTF_8.name());
        boolean hasX = request.getParameterValues("x") != null;
        boolean hasY = request.getParameterValues("y") != null;
        boolean hasR = request.getParameterValues("r") != null;

        if (hasX && hasY && hasR) {
            getServletContext().getNamedDispatcher("AreaCheckServlet").forward(request, response);
            return;
        }
        if (hasX || hasY || hasR || request.getParameterValues("source") != null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            request.setAttribute("error", "Передайте X, Y и R");
        }
        showForm(request, response);
    }

    private void showForm(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setAttribute("history", resultsBean(request).getResults());
        request.getRequestDispatcher("/WEB-INF/form.jsp").forward(request, response);
    }

    static ResultsBean resultsBean(HttpServletRequest request) {
        HttpSession session = request.getSession();
        synchronized (session) {
            ResultsBean bean = (ResultsBean) session.getAttribute("resultsBean");
            if (bean == null) {
                bean = new ResultsBean();
                session.setAttribute("resultsBean", bean);
            }
            return bean;
        }
    }
}
