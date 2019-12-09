var apiUrl = localStorageGetItem("api-url") || "http://119.235.53.59:3000";
var serverUrl = "http://119.235.53.59:5000";
var wait = localStorageGetItem("wait") || false;
var pbUrl = "https://pb.judge0.com";
var check_timeout = 200;

var blinkStatusLine = ((localStorageGetItem("blink") || "true") === "true");

var layout;

var sourceEditor;
var stdinEditor;
var stdoutEditor;
var stderrEditor;
var compileOutputEditor;
var sandboxMessageEditor;

var isEditorDirty = false;
var currentLanguageId;

var $selectLanguage;
var $insertTemplateBtn;
var $runBtn;
var $submitBtn;

var $statusLine;

var timeStart;
var timeEnd;

var layoutConfig = {
    settings: {
        showPopoutIcon: false,
        reorderEnabled: false
    },
    dimensions: {
        borderWidth: 3,
        headerHeight: 22
    },
    content: [{
        type: "row",
        content: [{
            type: "component",
            componentName: "source",
            title: "SOURCE",
            isClosable: false,
            componentState: {
                readOnly: false
            }
        }, {
            type: "column",
            content: [{
                type: "stack",
                content: [{
                    type: "component",
                    componentName: "stdin",
                    title: "STDIN",
                    isClosable: false,
                    componentState: {
                        readOnly: false
                    }
                }]
            }, {
                type: "stack",
                content: [{
                        type: "component",
                        componentName: "stdout",
                        title: "STDOUT",
                        isClosable: false,
                        componentState: {
                            readOnly: true
                        }
                    }, {
                        type: "component",
                        componentName: "stderr",
                        title: "STDERR",
                        isClosable: false,
                        componentState: {
                            readOnly: true
                        }
                    }, {
                        type: "component",
                        componentName: "compile output",
                        title: "COMPILE OUTPUT",
                        isClosable: false,
                        componentState: {
                            readOnly: true
                        }
                    }, {
                        type: "component",
                        componentName: "sandbox message",
                        title: "SANDBOX MESSAGE",
                        isClosable: false,
                        componentState: {
                            readOnly: true
                        }
                    }]
            }]
        }]
    }]
};

function encode(str) {
    return btoa(unescape(encodeURIComponent(str || "")));
}

function decode(bytes) {
    var escaped = escape(atob(bytes || ""));
    try {
        return decodeURIComponent(escaped);
    } catch {
        return unescape(escaped);
    }
}

function localStorageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (ignorable) {
  }
}

function localStorageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (ignorable) {
    return null;
  }
}

function showApiUrl() {
    $("#api-url").attr("href", apiUrl);
}

function showError(title, content) {
    $("#site-modal #title").html(title);
    $("#site-modal .content").html(content);
    $("#site-modal").modal("show");
}

function handleError(jqXHR, textStatus, errorThrown) {
    showError(`${jqXHR.statusText} (${jqXHR.status})`, `<pre>${JSON.stringify(jqXHR, null, 4)}</pre>`);
}

function handleError2(jqXHR, textStatus, errorThrown) {
    showError(`${"Error"} (${jqXHR.status})`, `<pre>${jqXHR.responseJSON.message}</pre>`);
}

function handleMyResult2(data) {
    showError(`<h1 style="color: ${data.color}">${"Score - "}${data.score}</h1>`, `<pre style="font-size: large; color: ${data.color}">${data.message}</pre>`);
}

function handleMyResult(data) {
    handleMyResult2(data);
    $submitBtn.removeClass("loading");
}

function handleRunError(jqXHR, textStatus, errorThrown) {
    handleError(jqXHR, textStatus, errorThrown);
    $runBtn.removeClass("loading");
}

function handleRunError2(jqXHR, textStatus, errorThrown) {
    handleError2(jqXHR, textStatus, errorThrown);
    $submitBtn.removeClass("loading");
}

function handleResult(data) {
    timeEnd = performance.now();
    console.log("It took " + (timeEnd - timeStart) + " ms to get submission result.");

    var status = data.status;
    var stdout = decode(data.stdout);
    var stderr = decode(data.stderr);
    var compile_output = decode(data.compile_output);
    var sandbox_message = decode(data.message);
    var time = (data.time === null ? "-" : data.time + "s");
    var memory = (data.memory === null ? "-" : data.memory + "KB");

    $statusLine.html(`${status.description}, ${time}, ${memory}`);

    if (blinkStatusLine) {
        $statusLine.addClass("blink");
        setTimeout(function() {
            blinkStatusLine = false;
            localStorageSetItem("blink", "false");
            $statusLine.removeClass("blink");
        }, 3000);
    }

    stdoutEditor.setValue(stdout);
    stderrEditor.setValue(stderr);
    compileOutputEditor.setValue(compile_output);
    sandboxMessageEditor.setValue(sandbox_message);

    if (stdout !== "") {
        var dot = document.getElementById("stdout-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }
    if (stderr !== "") {
        var dot = document.getElementById("stderr-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }
    if (compile_output !== "") {
        var dot = document.getElementById("compile-output-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }
    if (sandbox_message !== "") {
        var dot = document.getElementById("sandbox-message-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }

    $runBtn.removeClass("loading");
}

function handleResult2(data) {
    timeEnd = performance.now();

    var status = data.score;
    
    var stdout;

    if (status === 100){
        stdout = "All testcases satisfied, score: 100";
    } else if (status === 50){
        stdout = "Not all testcases were satisfied, score: 50";
    } else if (status === 25){
        stdout = "Not all testcases were satisfied, score: 25";
    } else if(status === 0) {
        stdout = "No testcases were satisfied, score: 0";
    } else {
        stdout = "An error occured, have you logged in?";
    }
    
    var time = data.submissionTime;

    $statusLine.html(`${status}, ${time}`);

    if (blinkStatusLine) {
        $statusLine.addClass("blink");
        setTimeout(function() {
            blinkStatusLine = false;
            localStorageSetItem("blink", "false");
            $statusLine.removeClass("blink");
        }, 3000);
    }

    stdoutEditor.setValue(stdout);

    if (stdout !== "") {
        var dot = document.getElementById("stdout-dot");
        if (!dot.parentElement.classList.contains("lm_active")) {
            dot.hidden = false;
        }
    }

    $submitBtn.removeClass("loading");
}


function run() {
    if (sourceEditor.getValue().trim() === "") {
        showError("Error", "Source code can't be empty!");
        return;
    } else {
        $runBtn.addClass("loading");
    }

    document.getElementById("stdout-dot").hidden = true;
    document.getElementById("stderr-dot").hidden = true;
    document.getElementById("compile-output-dot").hidden = true;
    document.getElementById("sandbox-message-dot").hidden = true;

    stdoutEditor.setValue("");
    stderrEditor.setValue("");
    compileOutputEditor.setValue("");
    sandboxMessageEditor.setValue("");

    var sourceValue = encode(sourceEditor.getValue());
    var stdinValue = encode(stdinEditor.getValue());
    var languageId = $selectLanguage.val();

    if (languageId === "44") {
        sourceValue = sourceEditor.getValue();
    }

    var data = {
        source_code: sourceValue,
        language_id: languageId,
        stdin: stdinValue
    };

    timeStart = performance.now();
    $.ajax({
        url: apiUrl + `/submissions?base64_encoded=true&wait=${wait}`,
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (data, textStatus, jqXHR) {
            if (wait == true) {
                handleResult(data);
            } else {
                setTimeout(fetchSubmission.bind(null, data.token), check_timeout);
            }
        },
        error: handleRunError
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
 }
 
function submit() {
    if (sourceEditor.getValue().trim() === "") {
        showError("Error", "Source code can't be empty!");
        return;
    } else {
        $submitBtn.addClass("loading");
    }

    document.getElementById("stdout-dot").hidden = true;
    document.getElementById("stderr-dot").hidden = true;
    document.getElementById("compile-output-dot").hidden = true;
    document.getElementById("sandbox-message-dot").hidden = true;

    stdoutEditor.setValue("");
    stderrEditor.setValue("");
    compileOutputEditor.setValue("");
    sandboxMessageEditor.setValue("");

    // var sourceValue = encode(sourceEditor.getValue());
    // var stdinValue = encode(stdinEditor.getValue());
    var sourceValue = sourceEditor.getValue();
    var stdinValue = stdinEditor.getValue();
    var languageId = $selectLanguage.val();

    if (languageId === "44") {
        sourceValue = sourceEditor.getValue();
    }
    let windowUrl = window.location.href;

    var data = {
        source_code: sourceValue,
        language_id: languageId,
        stdin: stdinValue,
        contestId: getCookie('contestId'),
        questionId: windowUrl.slice(serverUrl.length+5, windowUrl.length)
    };

    timeStart = performance.now();
    $.ajax({
        url: serverUrl+'/validateSubmission',
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify(data),
        headers: {
            'authorization': getCookie('token')
        },
        success: function (data, textStatus, jqXHR) {
            // handleResult2(data);
            if (data.score === 100){
                data.message = "All testcases satisfied, score: 100";
            } else if (data.score === 50){
                data.message = "Not all testcases were satisfied, score: 50";
            } else if (data.score === 25){
                data.message = "Not all testcases were satisfied, score: 25";
            } else if(data.score === 0) {
                data.message = "No testcases were satisfied, score: 0";
            } else {
                data.message = "An error occured, have you logged in?";
            }
            handleMyResult(data);
        },
        error: handleRunError2
    });
}
function fetchSubmission(submission_token) {
    $.ajax({
        url: apiUrl + "/submissions/" + submission_token + "?base64_encoded=true",
        type: "GET",
        async: true,
        success: function (data, textStatus, jqXHR) {
            if (data.status.id <= 2) { // In Queue or Processing
                setTimeout(fetchSubmission.bind(null, submission_token), check_timeout);
                return;
            }
            handleResult(data);
        },
        error: handleRunError
    });
}

function fetchSubmission2(submission_token) {
    $.ajax({
        url: serverUrl + "/submissions/" + submission_token + "?base64_encoded=true",
        type: "GET",
        async: true,
        success: function (data, textStatus, jqXHR) {
            if (data.status.id <= 2) { // In Queue or Processing
                setTimeout(fetchSubmission.bind(null, submission_token), check_timeout);
                return;
            }
            handleResult(data);
        },
        error: handleRunError
    });
}
function changeEditorLanguage() {
    monaco.editor.setModelLanguage(sourceEditor.getModel(), $selectLanguage.find(":selected").attr("mode"));
    currentLanguageId = parseInt($selectLanguage.val());
    $(".lm_title")[0].innerText = fileNames[currentLanguageId];
}

function insertTemplate() {
    currentLanguageId = parseInt($selectLanguage.val());
    sourceEditor.setValue(sources[currentLanguageId]);
    changeEditorLanguage();
}

function loadRandomLanguage() {
    // $selectLanguage.dropdown("set selected", Math.floor(Math.random() * $selectLanguage[0].length));
    $selectLanguage.dropdown("set selected", 34);
    
    insertTemplate();
}

function setQuestionId() {
    windowUrl = window.location.href;
    let questionId = windowUrl.slice(serverUrl.length+5, windowUrl.length);
    console.log(questionId);
    document.getElementById('questionIdText').innerHTML = questionId;
}

$(window).resize(function() {
    layout.updateSize();
});

$(document).ready(function () {

    $selectLanguage = $("#select-language");
    $selectLanguage.change(function (e) {
        if (!isEditorDirty) {
            insertTemplate();
        } else {
            changeEditorLanguage();
        }
    });

    $insertTemplateBtn = $("#insert-template-btn");
    $insertTemplateBtn.click(function (e) {
        if (isEditorDirty && confirm("Are you sure? Your current changes will be lost.")) {
            insertTemplate();
        }
    });

    $runBtn = $("#run-btn");
    $runBtn.click(function (e) {
        run();
    });
    $submitBtn = $("#submit-btn");
    $submitBtn.click(function (e) {
        submit();
    });

    $statusLine = $("#status-line");

    $("body").keydown(function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 120) { // F9
            e.preventDefault();
            run();
        } else if (keyCode == 119) { // F8
            e.preventDefault();
            var url = prompt("Enter URL of Judge0 API:", apiUrl);
            if (url != null) {
                url = url.trim();
            }
            if (url != null && url != "") {
                apiUrl = url;
                localStorageSetItem("api-url", apiUrl);
                showApiUrl();
            }
        } else if (keyCode == 118) { // F7
            e.preventDefault();
            wait = !wait;
            localStorageSetItem("wait", wait);
            alert(`Submission wait is ${wait ? "ON. Enjoy" : "OFF"}.`);
        } else if (event.ctrlKey && keyCode == 83) { // Ctrl+S
            e.preventDefault();
            save();
        }
    });

    $("select.dropdown").dropdown();
    $(".ui.dropdown").dropdown();
    $(".ui.dropdown.site-links").dropdown({action: "hide", on: "hover"});
    $(".ui.checkbox").checkbox();
    $(".message .close").on("click", function () {
        $(this).closest(".message").transition("fade");
    });

    showApiUrl();

    require(["vs/editor/editor.main"], function () {
        layout = new GoldenLayout(layoutConfig, $("#site-content"));

        layout.registerComponent("source", function (container, state) {
            sourceEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "cpp"
            });

            sourceEditor.getModel().onDidChangeContent(function (e) {
                currentLanguageId = parseInt($selectLanguage.val());
                isEditorDirty = sourceEditor.getValue() != sources[currentLanguageId];
            });
        });

        layout.registerComponent("stdin", function (container, state) {
            stdinEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext"
            });
        });

        layout.registerComponent("stdout", function (container, state) {
            stdoutEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext"
            });

            container.on("tab", function(tab) {
                tab.element.append("<span id=\"stdout-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", function(e) {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.registerComponent("stderr", function (container, state) {
            stderrEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext"
            });

            container.on("tab", function(tab) {
                tab.element.append("<span id=\"stderr-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", function(e) {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.registerComponent("compile output", function (container, state) {
            compileOutputEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext"
            });

            container.on("tab", function(tab) {
                tab.element.append("<span id=\"compile-output-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", function(e) {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.registerComponent("sandbox message", function (container, state) {
            sandboxMessageEditor = monaco.editor.create(container.getElement()[0], {
                automaticLayout: true,
                theme: "vs-dark",
                scrollBeyondLastLine: false,
                readOnly: state.readOnly,
                language: "plaintext"
            });

            container.on("tab", function(tab) {
                tab.element.append("<span id=\"sandbox-message-dot\" class=\"dot\" hidden></span>");
                tab.element.on("mousedown", function(e) {
                    e.target.closest(".lm_tab").children[3].hidden = true;
                });
            });
        });

        layout.on("initialised", function () {
            loadRandomLanguage();
            setQuestionId();
            $("#site-navigation").css("border-bottom", "1px solid black");
        });

        layout.init();
    });
});

// Template Sources
var bashSource = "echo \"hello, world\"\n";

var basicSource = "PRINT \"hello, world\"\n";

var cSource = "\
#include <stdio.h>\n\
\n\
int main(void) {\n\
    printf(\"hello, world\\n\");\n\
    return 0;\n\
}\n";

var cppSource = "\
#include <iostream>\n\
\n\
int main() {\n\
    std::cout << \"hello, world\" << std::endl;\n\
    return 0;\n\
}\n";

var csharpSource = "\
public class Hello {\n\
    public static void Main() {\n\
        System.Console.WriteLine(\"hello, world\");\n\
    }\n\
}\n";

var clojureSource = "(println \"hello, world\")\n";

var crystalSource = "puts \"hello, world\"\n";

var elixirSource = "IO.puts \"hello, world\"\n";

var erlangSource = "\
main(_) ->\n\
    io:fwrite(\"hello, world\\n\").\n";

var goSource = "\
package main\n\
\n\
import \"fmt\"\n\
\n\
func main() {\n\
    fmt.Println(\"hello, world\")\n\
}\n";

var haskellSource = "main = putStrLn \"hello, world\"\n";

var insectSource = "\
2 min + 30 s\n\
40 kg * 9.8 m/s^2 * 150 cm\n\
sin(30°)\n";

var javaSource = "\
public class Main {\n\
    public static void main(String[] args) {\n\
        System.out.println(\"hello, world\");\n\
    }\n\
}\n";

var javaScriptSource = "console.log(\"hello, world\");\n";

var ocamlSource = "print_endline \"hello, world\";;\n";

var octaveSource = "printf(\"hello, world\\n\");\n";

var pascalSource = "\
program Hello;\n\
begin\n\
    writeln ('hello, world')\n\
end.\n";

var pythonSource = "print(\"hello, world\")\n";

var rubySource = "puts \"hello, world\"\n";

var rustSource = "\
fn main() {\n\
    println!(\"hello, world\");\n\
}\n"

var textSource = "hello, world\n";

var executableSource = "\
Judge0 IDE assumes that content of executable is Base64 encoded.\n\
\n\
This means that you should Base64 encode content of your binary,\n\
paste it here and click \"Run\".\n\
\n\
Here is an example of compiled \"hello, world\" NASM program.\n\
Content of compiled binary is Base64 encoded and used as source code.\n\
\n\
https://ide.judge0.com/?kS_f\n\
";

var sources = {
    1: bashSource,
    2: bashSource,
    3: basicSource,
    4: cSource,
    5: cSource,
    6: cSource,
    7: cSource,
    8: cSource,
    9: cSource,
    10: cppSource,
    11: cppSource,
    12: cppSource,
    13: cppSource,
    14: cppSource,
    15: cppSource,
    16: csharpSource,
    17: csharpSource,
    18: clojureSource,
    19: crystalSource,
    20: elixirSource,
    21: erlangSource,
    22: goSource,
    23: haskellSource,
    24: haskellSource,
    25: insectSource,
    26: javaSource,
    27: javaSource,
    28: javaSource,
    29: javaScriptSource,
    30: javaScriptSource,
    31: ocamlSource,
    32: octaveSource,
    33: pascalSource,
    34: pythonSource,
    35: pythonSource,
    36: pythonSource,
    37: pythonSource,
    38: rubySource,
    39: rubySource,
    40: rubySource,
    41: rubySource,
    42: rustSource,
    43: textSource,
    44: executableSource,
};

var fileNames = {
    1: "script.sh",
    2: "script.sh",
    3: "main.bas",
    4: "main.c",
    5: "main.c",
    6: "main.c",
    7: "main.c",
    8: "main.c",
    9: "main.c",
    10: "main.cpp",
    11: "main.cpp",
    12: "main.cpp",
    13: "main.cpp",
    14: "main.cpp",
    15: "main.cpp",
    16: "Main.cs",
    17: "Main.cs",
    18: "main.clj",
    19: "main.cr",
    20: "main.exs",
    21: "main.erl",
    22: "main.go",
    23: "main.hs",
    24: "main.hs",
    25: "main.ins",
    26: "Main.java",
    27: "Main.java",
    28: "Main.java",
    29: "main.js",
    30: "main.js",
    31: "main.ml",
    32: "file.m",
    33: "main.pas",
    34: "main.py",
    35: "main.py",
    36: "main.py",
    37: "main.py",
    38: "main.rb",
    39: "main.rb",
    40: "main.rb",
    41: "main.rb",
    42: "main.rs",
    43: "source.txt",
    44: "a.out"
};
