import LocalStorageService from '../../services/LocalStorageService'
import type { Exact, Uuid, Action } from '../../types'
export type State = {
  readonly currentProjectStepById: Uuid | null | undefined
  readonly currentProjectById: Uuid | null | undefined
  readonly showConsultationPlanById: Record<Uuid, boolean>
  readonly projectsById: Record<Uuid, Record<string, any>>
  readonly projectTypes: Array<Record<string, any>>
  readonly limit: number | null | undefined
  readonly orderBy: string
  readonly term: string | null | undefined
  readonly status: string | null | undefined
  readonly isLoading: boolean
  readonly count: number
  readonly selectedActiveItems: Array<string>
}
const initialState: State = {
  currentProjectStepById: null,
  currentProjectById: null,
  showConsultationPlanById: {},
  projectsById: {},
  projectTypes: [],
  limit: null,
  orderBy: 'PUBLISHED_AT',
  term: null,
  status: null,
  isLoading: true,
  count: 0,
  selectedActiveItems: [],
}
type ChangeOrderByAction = {
  type: 'project/CHANGE_ORDER_BY'
  orderBy: string
}
type ChangeProjectTermAction = {
  type: 'project/CHANGE_TERM'
  term: string | null | undefined
}
type CloseConsultationPlanAction = {
  type: 'project/CLOSE_CONSULTATION_PLAN'
  id: string
}
type OpenConsultationPlanAction = {
  type: 'project/OPEN_CONSULTATION_PLAN'
  id: string
}
type ChangeConsultationPlanActiveItemsAction = {
  type: 'proposal/CHANGE_CONSULTATION_PLAN_ACTIVE_ITEMS'
  items: Array<string>
}
export type ProjectAction =
  | ChangeOrderByAction
  | ChangeProjectTermAction
  | CloseConsultationPlanAction
  | OpenConsultationPlanAction
  | ChangeConsultationPlanActiveItemsAction
export const changeOrderBy = (orderBy: string): ChangeOrderByAction => ({
  type: 'project/CHANGE_ORDER_BY',
  orderBy,
})
export const changeTerm = (term: string | null | undefined): ChangeProjectTermAction => ({
  type: 'project/CHANGE_TERM',
  term,
})
export const closeConsultationPlan = (id: string): CloseConsultationPlanAction => ({
  type: 'project/CLOSE_CONSULTATION_PLAN',
  id,
})
export const openConsultationPlan = (id: string): OpenConsultationPlanAction => ({
  type: 'project/OPEN_CONSULTATION_PLAN',
  id,
})
export const changeConsultationPlanActiveItems = (items: Array<string>): ChangeConsultationPlanActiveItemsAction => ({
  type: 'proposal/CHANGE_CONSULTATION_PLAN_ACTIVE_ITEMS',
  items,
})
export const reducer = (state: State = initialState, action: Action): Exact<State> => {
  switch (action.type) {
    case '@@INIT':
      return { ...initialState, ...state }

    case 'project/CHANGE_ORDER_BY':
      return { ...state, orderBy: action.orderBy }

    case 'project/CHANGE_TERM':
      return { ...state, term: action.term }

    case 'project/OPEN_CONSULTATION_PLAN': {
      const data = { ...state.showConsultationPlanById, [action.id]: true }
      LocalStorageService.set('project.showConsultationPlanById', data)
      return { ...state, showConsultationPlanById: data }
    }

    case 'project/CLOSE_CONSULTATION_PLAN': {
      const data = { ...state.showConsultationPlanById, [action.id]: false }
      LocalStorageService.set('project.showConsultationPlanById', data)
      return { ...state, showConsultationPlanById: data }
    }

    case 'proposal/CHANGE_CONSULTATION_PLAN_ACTIVE_ITEMS': {
      return { ...state, selectedActiveItems: action.items }
    }

    default:
      return state
  }
}
