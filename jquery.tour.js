;var
tutorials =
    [
// put here your tutorials
/*
 * Sample :
 * {
 *    name: 'Create supplier',
 *    description: 'Learn how to create suppliers',
 *    scenario: [
 *    {
 *        action: 'click',
 *        name: 'Click in the Third Parties/Supplier/New section in the menu.',
 *        target: '#page_40 a',
 *    },
 *    {
 *        action: 'change',
 *        name: 'Input informations concerning the supplier you want to create.<br/>The corporate name and the companies are required to validate the form.',
 *        target: '#id_third_parties-supplier-name',
 *        value: 'Supplier Test Company'
 *    },
 *    {
 *        action: 'change',
 *        name: 'Select the supplier\'s country',
 *        target: '#id_third_parties-supplier-country',
 *        value: 70
 *    },
 *    {
 *        action: 'submit',
 *        name: 'Then click on Save to submit the form and save data',
 *        target: '#third_party_form',
 *        highlight: '#third_party_form :submit[name!=redirect_to]'
 *    }
 *    ]
 * },
 * {
 *    name: 'Create product',
 *    description: 'Learn how to create products',
 *    scenario: {
 *    }
 * },
 */
]
;

(function($) {
        $(document).ready(function() {
                var
                initTutorial = function(dialog, link) {
                    _dialog
                    .dialog(
                        'option',
                        'close',
                        function() {
                            $.cookie('tutorial_num', -1, { path: '/' });
                            $.cookie('tutorial_step', -1, { path: '/' });
                            $.cookie('tutorial_opened', false, { path: '/' });
                            $.cookie('tutorial_position_x', '', { path: '/' }),
                            $.cookie('tutorial_position_y', '', { path: '/' }),
                            link.fadeIn('slow');
                        }
                    )
                    .dialog(
                        'option',
                        'dragStop',
                        function(event, ui) {
                            $.cookie('tutorial_position_x', $(this).position().left, { path: '/' });
                            $.cookie('tutorial_position_y', $(this).position().top, { path: '/' });
                        }
                    )
                    ;

                    var _tutorial_num = parseInt($.cookie('tutorial_num'));
                    var _tutorial_step = parseInt($.cookie('tutorial_step'));

                    var _dialog_position_x = $.cookie('tutorial_position_x');
                    if(_dialog_position_x) {
                        _dialog_position_x = parseInt(_dialog_position_x);
                    } else {
                        _dialog_position_x = 'center';
                    }
                    var _dialog_position_y = $.cookie('tutorial_position_y');
                    if(_dialog_position_y) {
                        _dialog_position_y = parseInt(_dialog_position_y);
                    } else {
                        _dialog_position_y = 'center';
                    }

                    if($.cookie('tutorial_num') && _tutorial_num > -1) {
                        link.hide();
                        launchTutorial(dialog, _tutorial_num, _tutorial_step);
                        dialog
                        .dialog('option', 'position', [ _dialog_position_x, _dialog_position_y ])
                        .dialog('open');
                        return;
                    }

                    _dialog
                    .empty()
                    .dialog(
                        'option',
                        'title',
                        'Select a tutorial'
                    )
                    .append("<p>You can drag me by clicking on my title.</p>")
                    .dialog('open');

                    $.map(tutorials, function(tutorial) {
                            $("<p>" + tutorial.name + "</p>")
                            .css("cursor", "pointer")
                            .click(function(e) {
                                    e.preventDefault();
                                    launchTutorial(
                                        $(e.target).closest('.ui-dialog-content'),
                                        $.inArray(tutorial, tutorials),
                                        1
                                    );
                                }
                            )
                            .prependTo(
                                $("<li></li>")
                                .append("<p>" + tutorial.description + "</p>")
                                .appendTo(dialog)
                            );
                        }
                    );

                    dialog.find('li').wrapAll("<ol></ol>");
                },

                next_step = function() {
                    var
                    _current_step,
                    current_step = $.cookie('tutorial_step');
                    if(isNaN(current_step)) {
                        _current_step = 1;
                    } else {
                        _current_step = parseInt(current_step);
                    }

                    if(_current_step >= tutorials[parseInt($.cookie('tutorial_num'))].scenario.length) {
                        $.cookie('tutorial_opened', false, { path: '/' });
                        $.cookie('tutorial_num', -1, { path: '/' });
                        $.cookie('tutorial_step', -1, { path: '/' });
                    } else {
                        $.cookie('tutorial_step', (_current_step + 1), { path: '/' });
                    }
                },

                launchTutorial = function(dialog, idx, current_step) {
                    if($.cookie('tutorial_opened') == 'false') {
                        dialog.dialog('close');
                        return;
                    }
                    if(current_step < 0) {
                        current_step = 1;
                    }
                    $.cookie('tutorial_num', idx, { path: '/' });
                    $.cookie('tutorial_step', current_step, { path: '/' });

                    $("<div></div>")
                    .append(
                        dialog.
                        children()
                    )
                    .appendTo(dialog)
                    .fadeOut('slow', function() {
                            dialog
                            .empty()
                            .dialog(
                                'option',
                                'title',
                                tutorials[idx].name
                            );
                            $.map(tutorials[idx].scenario, function(step, index) {
                                    var step_target = $(step.target);
                                    var step_highlight;

                                    if(step.highlight) {
                                        step_highlight = $(step.highlight);
                                    } else {
                                        step_highlight = step_target;
                                    }
                                    var step_target_background = step_target.css('background-color');
                                    var step_target_color = step_target.css('color');

                                    $("<p>"+step.name+"</p>")
                                    .hover(
                                        function(e) {
                                            if($(this).css('font-weight') == 'bold') {
                                                step_highlight
                                                .stop()
                                                .animate(
                                                    {
                                                        backgroundColor: 'yellow',
                                                        color: 'black'
                                                    },
                                                    500
                                                )
                                                .parents()
                                                .show();
                                            }
                                        },
                                        function(e) {
                                            if($(this).css('font-weight') == 'bold') {
                                                step_highlight
                                                .stop()
                                                .animate(
                                                    {
                                                        backgroundColor: step_target_background,
                                                        color: step_target_color
                                                    },
                                                    500
                                                );
                                            }
                                        }
                                    )
                                    .click(function(e) {
                                            $(this)
                                            .trigger("mouseleave")
                                            .unbind("mouseenter mouseleave");

                                            step_target.trigger(step.action);

                                            if(step.action == 'click') {
                                                if(step_target.attr('href')) {
                                                    window.location = step_target.attr('href');
                                                }
                                            }
                                            else if (step.action == 'change') {
                                                step_target.val(step.value);
                                            }
                                            else if (step.action == 'submit') {
                                                step_target.submit();
                                            }
                                        }
                                    )
                                    .appendTo(
                                        $("<li></li>")
                                        .hide()
                                        .appendTo(dialog)
                                    );

                                    if(index == current_step - 1) {
                                        step_target.one(step.action, function(e) {
                                                next_step();
                                                launchTutorial(dialog, idx, current_step + 1);
                                            }
                                        );
                                    }
                                }
                            );
                            dialog
                            .find('li')
                            .wrapAll("<ol></ol>")
                            .fadeIn('fast');

                            dialog
                            .find('ol li:nth-child('+current_step+')')
                            .css(
                                {
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }
                            )
                            .nextAll()
                            .css('color', '#aaa')
                            ;
                        }
                    );
                },
                _body = $("body")
                ;

                var _link = $('<div></div>')
                .css(
                    {
                        position: 'fixed',
                        bottom: '0px',
                        right: '0px',
                    }
                );

                var _dialog = $('<div></div>')

                $('<div>Run a tutorial</div>')
                .css(
                    {
                        backgroundColor: 'DarkSeaGreen',
                        padding: "2px 5px",
                        '-moz-border-radius-topleft': '3px',
                        '-webkit-border-top-left-radius': '3px',
                        cursor: "pointer",
                        fontWeight: 'bold',
                        opacity: 0.4
                    }
                )
                .hover(
                    function() {
                        $(this)
                        .stop()
                        .animate(
                            {
                                opacity: 1
                            },
                            500
                        );
                    },
                    function() {
                        $(this)
                        .stop()
                        .animate(
                            {
                                opacity: 0.4
                            },
                            500
                        );
                    }
                )
                .click(function(e) {
                        var _this = $(this);
                        _this.fadeOut('fast');
                        $.cookie('tutorial_opened', true, { path: '/' });
                        initTutorial(_dialog, _this);
                    }
                )
                .appendTo(_link);

                _link.appendTo("body");

                _dialog
                .appendTo("body")
                .dialog(
                    {
                        autoOpen: false,
                        height: 'auto',
                        zIndex: 2001
                    }
                );

                if($.cookie('tutorial_opened')=='true') {
                    initTutorial(_dialog, _link);
                }
            }
        );
    }
)(jQuery);
