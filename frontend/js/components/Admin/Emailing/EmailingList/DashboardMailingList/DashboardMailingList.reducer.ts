import { $PropertyType } from 'utility-types'
import { getFieldsFromUrl } from '~/shared/utils/getFieldsFromUrl'
export type DashboardStatus = 'ready' | 'loading'
export type Filters = {
  readonly term: string | null | undefined
}
export const DEFAULT_FILTERS: Filters = {
  term: null,
}
export type DashboardState = {
  readonly status: DashboardStatus
  readonly filters: Filters
}
export type DashboardParameters = {
  readonly filters: $PropertyType<DashboardState, 'filters'>
}
export type Action =
  | {
      type: 'START_LOADING'
    }
  | {
      type: 'STOP_LOADING'
    }
  | {
      type: 'SEARCH_TERM'
      payload: string | null | undefined
    }
  | {
      type: 'CLEAR_TERM'
    }
  | {
      type: 'INIT_FILTERS_FROM_URL'
    }
export const createReducer = (state: DashboardState, action: Action) => {
  switch (action.type) {
    case 'START_LOADING':
      return { ...state, status: 'loading' }

    case 'STOP_LOADING':
      return { ...state, status: 'ready' }

    case 'SEARCH_TERM':
      return { ...state, filters: { ...state.filters, term: action.payload } }

    case 'CLEAR_TERM':
      return { ...state, filters: { ...state.filters, term: null } }

    case 'INIT_FILTERS_FROM_URL': {
      const url = new URL(window.location.href)
      const filters = getFieldsFromUrl<Filters>(url, {
        default: DEFAULT_FILTERS,
        whitelist: ['term'],
      })
      return { ...state, filters }
    }

    default:
      throw new Error(`Unknown action : ${action.type}`)
  }
}
