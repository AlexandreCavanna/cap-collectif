<?php

namespace Capco\AdminBundle\Controller;

use Capco\AppBundle\Repository\MenuItemRepository;
use Capco\AdminBundle\Controller\CRUDController as Controller;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class MenuItemController extends Controller
{
    /**
     * @param array $selectedIds
     * @param $allEntitiesSelected
     *
     * @return bool|string
     */
    public function batchActionDeleteIsRelevant(array $selectedIds, $allEntitiesSelected)
    {
        foreach ($selectedIds as $id) {
            $item = $this->container->get(MenuItemRepository::class)->find($id);
            if (!$item->getIsDeletable()) {
                return 'admin.action.menu_item.batch_delete.denied';
            }
        }

        return true;
    }

    /**
     * Delete action.
     *
     * @param Request         $request
     *
     * @throws NotFoundHttpException If the object does not exist
     * @throws AccessDeniedException If access is not granted
     *
     * @return Response|RedirectResponse
     */
    public function deleteAction(Request $request): Response
    {
        $id = $request->get($this->admin->getIdParameter());
        $object = $this->admin->getObject($id);

        if (!$object->getIsDeletable()) {
            throw $this->createAccessDeniedException();
        }

        return parent::deleteAction($request);
    }
}
