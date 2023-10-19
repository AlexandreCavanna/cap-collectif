// @ts-nocheck
import colors from './utils/colors'
/*eslint-disable */
;(function ($) {
  'use strict'

  $.fn.googleCharts = function (options) {
    // @ts-expect-error
    if (typeof google == 'undefined') {
      return
    }

    this.each(function () {
      if ($(`#piechart-${$(this).data('pie-id')}`).length) {
        var pie_chart
        var options
        var data
        data = new google.visualization.DataTable()
        data.addColumn('string', 'Task')
        data.addColumn('number', 'Values')
        data.addRows([
          ["D'accord", $(this).data('ok')],
          ['Mitigé', $(this).data('mitige')],
          ["Pas d'accord", $(this).data('nok')],
        ])
        options = {
          legend: 'none',
          colors: colors.votes,
          pieSliceText: 'value',
          backgroundColor: 'transparent',
        }
        pie_chart = new google.visualization.PieChart( // @ts-expect-error
          document.getElementById(`piechart-${$(this).data('pie-id')}`),
        )
        pie_chart.draw(data, options)
      }
    })
    return this
  }
})(jQuery)
