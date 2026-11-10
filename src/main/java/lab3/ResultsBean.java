package lab3;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public final class ResultsBean implements Serializable {
    private final List<CheckResult> results = new ArrayList<>();

    public synchronized void add(CheckResult result) {
        results.add(0, result);
    }

    public synchronized List<CheckResult> getResults() {
        return List.copyOf(results);
    }
}
